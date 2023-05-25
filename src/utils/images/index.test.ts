import * as permissions from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-clipboard/clipboard';
import { waitFor } from '@testing-library/react-native';
import useModalStore from '~/store/modal';
import {
  copyImageFromUrl, createLinkImageDownload, downloadImage, getFileExtensionFromUrl, getImagePastedFromClipboard,
} from '.';

describe('images utils', () => {
  let Platform: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
  });

  it('should run downloadImage on iOS permission refused', async () => {
    Platform.OS = 'ios';
    const showAlert = jest.fn();
    const actions = { showAlert };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);

    downloadImage({ url: 'https://download/image.jpg' });

    await waitFor(() => {
      expect(showAlert).toBeCalled();
    });
  });

  it('should run downloadImage on android permission refused', async () => {
    Platform.OS = 'android';
    const showAlert = jest.fn();
    const actions = { showAlert };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);

    downloadImage({ url: 'https://download/image.jpg' });

    await waitFor(() => {
      expect(showAlert).toBeCalled();
    });
  });

  it('should run downloadImage on android success', async () => {
    Platform.OS = 'android';
    jest.spyOn(RNFetchBlob, 'fetch').mockImplementation(() => Promise.resolve() as any);
    jest.spyOn(RNFetchBlob, 'config');
    const showToast = jest.fn();
    const actions = { showToast };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.GRANTED);

    downloadImage({ url: 'https://download/image.jpg', id: '123' });

    await waitFor(() => {
      expect(showToast).toBeCalled();
    });
  });

  it('should not run downloadImage', async () => {
    Platform.OS = 'android';
    jest.spyOn(RNFetchBlob, 'fetch');

    downloadImage(null);

    expect(RNFetchBlob.fetch).not.toBeCalled();
  });

  it('should not run copyImageFromUrl', async () => {
    jest.spyOn(RNFetchBlob, 'fetch');

    copyImageFromUrl(null);

    expect(RNFetchBlob.fetch).not.toBeCalled();
  });

  it('should not run copyImageFromUrl', async () => {
    const url = 'https://picsum.photos/536/354';
    const response = {
      path: () => 'path',
      readFile: () => 'base64',
    };
    jest.spyOn(Clipboard, 'setImage');
    jest.spyOn(RNFetchBlob, 'config');
    jest.spyOn(RNFetchBlob, 'fetch').mockImplementation(() => response as any);
    const showToast = jest.fn();
    const actions = { showToast };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    copyImageFromUrl(url);

    await new Promise(process.nextTick);
    expect(RNFetchBlob.config).toBeCalledWith({ fileCache: true });
    expect(RNFetchBlob.fetch).toBeCalledWith('GET', url);

    await new Promise(process.nextTick);
    expect(Clipboard.setImage).toBeCalledWith('base64');
    expect(showToast).toBeCalled();
  });

  it('should not run copyImageFromUrl', () => {
    const files = [
      {
        fileName: '1.jpg', type: 'jpg', fileSize: 1024, uri: 'path://1.jpg',
      },
      {
        fileName: '2.jpg', type: 'png', fileSize: 2048, uri: 'path://2.png',
      },
    ];

    const filesError = [
      { error: 'error' },
    ];

    const filesError2 = [
      { error: 'error' },
      ...files,
    ];

    const test1 = getImagePastedFromClipboard([]);
    expect(test1).toEqual(null);

    const test2 = getImagePastedFromClipboard(filesError);
    expect(test2).toEqual(null);

    const test4 = getImagePastedFromClipboard(files);
    expect(test4).toEqual(files[0]);

    const test5 = getImagePastedFromClipboard(filesError2);
    expect(test5).toEqual(filesError2[1]);
  });

  it('createLinkImageDownload should not work if doesnt url', () => {
    expect(createLinkImageDownload('')).toBeUndefined();
  });

  it('createLinkImageDownload should return url with download param', () => {
    expect(createLinkImageDownload('https://picsum.photos/536/354')).toBe('https://picsum.photos/536/354?download=true');
  });

  it('getFileExtensionFromUrl should return extension if url has extension', () => {
    expect(getFileExtensionFromUrl('https://picsum.photos/536.jpg')).toBe('.jpg');
  });

  it('getFileExtensionFromUrl should return null if url doesnt has extension', () => {
    expect(getFileExtensionFromUrl('https://picsum.photos/536')).toBe(null);
  });
});

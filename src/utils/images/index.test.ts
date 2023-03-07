import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import * as permissions from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-clipboard/clipboard';
import useModalStore from '~/store/modal';
import { copyImageFromUrl, downloadImage, getImagePastedFromClipboard } from '.';

describe('images utils', () => {
  let Platform: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
  });

  it('should run downloadImage on iOS success', async () => {
    Platform.OS = 'ios';
    jest.spyOn(CameraRoll, 'save');
    const showToast = jest.fn();
    const actions = { showToast };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.GRANTED);

    downloadImage({ url: 'file://download/image.jpg' });

    await new Promise(process.nextTick);
    expect(CameraRoll.save).toBeCalledWith('file://download/image.jpg', { type: 'photo' });

    await new Promise(process.nextTick);
    expect(showToast).toBeCalled();
  });

  it('should run downloadImage on iOS failed', async () => {
    Platform.OS = 'ios';
    jest.spyOn(CameraRoll, 'save');
    const showAlert = jest.fn();
    const actions = { showAlert };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);

    downloadImage({ url: 'file://download/image.jpg' });

    await new Promise(process.nextTick);
    expect(showAlert).toBeCalled();
  });

  it('should run downloadImage on android success', async () => {
    Platform.OS = 'android';
    jest.spyOn(RNFetchBlob, 'fetch');
    jest.spyOn(RNFetchBlob, 'config');
    const showToast = jest.fn();
    const actions = { showToast };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.GRANTED);

    downloadImage({ url: 'file://download/image.jpg' });

    await new Promise(process.nextTick);
    expect(RNFetchBlob.config).toBeCalled();
    expect(RNFetchBlob.fetch).toBeCalledWith('GET', 'file://download/image.jpg');

    await new Promise(process.nextTick);
    expect(showToast).toBeCalled();
  });

  it('should run downloadImage on android failed', async () => {
    Platform.OS = 'android';
    jest.spyOn(RNFetchBlob, 'fetch');
    const showAlert = jest.fn();
    const actions = { showAlert };

    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);

    downloadImage({ url: 'file://download/image.jpg' });

    await new Promise(process.nextTick);
    expect(RNFetchBlob.fetch).not.toBeCalled();

    await new Promise(process.nextTick);
    expect(showAlert).toBeCalled();
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
});

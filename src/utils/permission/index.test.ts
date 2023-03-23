import * as permissions from 'react-native-permissions';
import { checkPermission, PermissionTypes } from '.';
import useModalStore from '~/store/modal';

describe('permission utils', () => {
  let Platform: any;
  const showModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
    const actions = { showModal };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));
  });

  it('should run checkPermission addPhoto GRANTED', async () => {
    Platform.OS = 'ios';
    const callback = jest.fn();
    await checkPermission(
      PermissionTypes.AddPhoto,
      callback,
    );

    expect(permissions.check).toBeCalledWith(permissions.PERMISSIONS.IOS.PHOTO_LIBRARY);
    expect(callback).toBeCalledWith(true);
  });

  it('should run checkPermission addPhoto DENIED', async () => {
    Platform.OS = 'android';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.DENIED);
    jest.spyOn(permissions, 'request').mockResolvedValue(permissions.RESULTS.DENIED);
    await checkPermission(
      PermissionTypes.AddPhoto,
      callback,
    );

    expect(permissions.check).toBeCalledWith(permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    expect(permissions.request).toBeCalledWith(permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    expect(callback).toBeCalledWith(false);
    expect(showModal).not.toBeCalled();
  });

  it('should run checkPermission addPhoto DENIED and request GRANTED', async () => {
    Platform.OS = 'android';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.DENIED);
    jest.spyOn(permissions, 'request').mockResolvedValue(permissions.RESULTS.GRANTED);
    await checkPermission(
      PermissionTypes.AddPhoto,
      callback,
    );

    expect(permissions.check).toBeCalledWith(permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    expect(permissions.request).toBeCalledWith(permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    expect(callback).toBeCalledWith(true);
    expect(showModal).not.toBeCalled();
  });

  it('should run checkPermission photo BLOCKED', async () => {
    Platform.OS = 'ios';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);
    await checkPermission(
      PermissionTypes.photo,
      callback,
    );

    expect(permissions.check).toBeCalledWith(permissions.PERMISSIONS.IOS.PHOTO_LIBRARY);
    expect(permissions.request).not.toBeCalled();
    expect(callback).toBeCalledWith(false);
    expect(showModal).toBeCalled();
  });

  it('should run checkPermission photo BLOCKED hide alert', async () => {
    Platform.OS = 'android';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.BLOCKED);
    await checkPermission(
      PermissionTypes.photo,
      callback,
      false,
    );

    expect(permissions.check).toBeCalledWith(permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    expect(permissions.request).not.toBeCalled();
    expect(callback).toBeCalledWith(false);
    expect(showModal).not.toBeCalled();
  });

  it('should run requestPermission photo throw error', async () => {
    Platform.OS = 'android';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockResolvedValue(permissions.RESULTS.DENIED);
    jest.spyOn(permissions, 'request').mockImplementation(() => {
      throw Error('checkPermission error');
    });
    const result = await checkPermission(
      PermissionTypes.photo,
      callback,
      false,
    );

    expect(result).toEqual(false);
    expect(callback).toBeCalledWith(false);
  });

  it('should run checkPermission photo throw error', async () => {
    Platform.OS = 'android';
    const callback = jest.fn();
    jest.spyOn(permissions, 'check').mockImplementation(() => {
      throw Error('checkPermission error');
    });
    const result = await checkPermission(
      PermissionTypes.photo,
      callback,
      false,
    );

    expect(result).toEqual(false);
    expect(callback).toBeCalledWith(false);
  });
});

import i18next from 'i18next';
import {
  formatPhoneNumber,
  getEndDateText, getLanguages, uploadFile, _openImagePicker,
} from './helper';
import * as PermissionUtils from '~/utils/permission';
import menuTypes from '../../../storeRedux/menu/types';

describe('UserProfile helper', () => {
  it('getLanguages: validate empty array', () => {
    const result = getLanguages([]);
    expect(result).toEqual('');
  });

  it('getLanguages: validate valued array', () => {
    const result = getLanguages(['en', 'vi']);
    expect(result).toEqual('English, Vietnamese');
  });

  it('getEndDateText: currentlyWorkHere true', () => {
    const result = getEndDateText(i18next.t, true, '2022-01-01');
    expect(result).toEqual('Present');
  });

  it('getEndDateText: currentlyWorkHere false', () => {
    const result = getEndDateText(i18next.t, false, '2022-01-01');
    expect(result).toEqual('Jan 1, 2022');
  });

  it('formatPhoneNumber: with country code', () => {
    const result = formatPhoneNumber('84', '987654321');
    expect(result).toEqual('+84 987654321');
  });

  it('formatPhoneNumber: without country code', () => {
    const result = formatPhoneNumber(null, '987654321');
    expect(result).toEqual('987654321');
  });

  it('_openImagePicker: callback should not be called if dont have permission', () => {
    jest.spyOn(PermissionUtils, 'checkPermission').mockImplementation(
      () => (
        Promise.resolve(false)
      ),
    );

    const dispatch = jest.fn();
    const callback = jest.fn();

    _openImagePicker('1', 'avatar', 'user_avatar', dispatch, callback);

    expect(callback).not.toBeCalled();
  });

  it('_openImagePicker: callback should be called if dont have permission', () => {
    const dispatch = jest.fn();
    const callback = jest.fn();
    // const permission call

    jest.spyOn(PermissionUtils, 'checkPermission').mockImplementation(
      (): Promise<boolean> => Promise.resolve(true),
    );

    _openImagePicker('1', 'avatar', 'user_avatar', dispatch, callback);

    expect(callback).toBeCalled();
  });

  it('uploadFile: callback should be called', () => {
    const dispatch = jest.fn();
    const callback = jest.fn();
    const file = { filename: '1', fileType: '1', uri: 'uri' } as any;
    uploadFile('1', file, 'avatar', 'user_avatar', dispatch, callback);

    expect(callback).toHaveBeenCalledWith('avatar');
  });

  it('uploadFile: callback should not be called', () => {
    const file = { filename: '1', fileType: '1', uri: 'uri' } as any;

    const dispatch = jest.fn();
    const callback = jest.fn();
    const mockActionUploadImage = () => ({
      type: menuTypes.UPLOAD_IMAGE,
      payload: file,
      callback: jest.fn(),
    });

    // const action = jest.spyOn(menuActions, 'uploadImage')
    //   .mockImplementation(mockActionUploadImage as any);

    uploadFile('1', file, 'avatar', 'user_avatar', dispatch);

    // expect(action).toHaveBeenCalled();
    expect(callback).not.toBeCalled();
  });
});

import RNPermissions from 'react-native-permissions';

import { _openImagePicker } from './helper';

describe('GeneralInformation helper', () => {
  it('should _openImagePicker success', () => {
    const checkPermission = jest.spyOn(RNPermissions, 'check').mockImplementation(
      () => Promise.resolve(RNPermissions.RESULTS.GRANTED) as any,
    );

    const result = _openImagePicker({
      dispatch: jest.fn(),
      id: '1',
      fieldName: 'icon',
      uploadType: 'user_avatar',
      destination: 'group',
      rootGroupId: '1',
    });
    expect(result).toBeTruthy();
    expect(checkPermission).toBeCalled();
  });
});

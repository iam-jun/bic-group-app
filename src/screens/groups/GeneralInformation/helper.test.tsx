import RNPermissions from 'react-native-permissions';
import { ResourceUploadType } from '~/interfaces/IUpload';

import { _openImagePicker } from './helper';
import { FieldNameImageUpload } from '~/interfaces/IGroup';

describe('GeneralInformation helper', () => {
  it('should _openImagePicker success', () => {
    const checkPermission = jest.spyOn(RNPermissions, 'check').mockImplementation(
      () => Promise.resolve(RNPermissions.RESULTS.GRANTED) as any,
    );

    const result = _openImagePicker({
      id: '1',
      fieldName: FieldNameImageUpload.ICON,
      uploadType: ResourceUploadType.groupAvatar,
      destination: 'group',
      rootGroupId: '1',
    });
    expect(result).toBeTruthy();
    expect(checkPermission).toBeCalled();
  });
});

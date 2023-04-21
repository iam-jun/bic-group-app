import { ResourceUploadType } from '~/interfaces/IUpload';
import { _openImagePicker } from './helper';
import { FieldNameImageUpload } from '~/interfaces/IGroup';
import * as permission from '~/utils/permission';

describe('GeneralInformation helper', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it('should _openImagePicker success', () => {
    Platform.OS = 'web';
    const spy = jest.spyOn(permission, 'checkPermission');

    const result = _openImagePicker({
      id: '1',
      fieldName: FieldNameImageUpload.AVATAR,
      uploadType: ResourceUploadType.groupAvatar,
      destination: 'group',
      rootGroupId: '1',
    });
    expect(result).toBeTruthy();
    expect(spy).toBeCalled();
  });
});

import ImagePicker from '~/beinComponents/ImagePicker';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { _openImagePicker } from './helper';

describe('GeneralInformation helper', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it('should _openImagePicker success', () => {
    Platform.OS = 'web';
    const spy = jest.spyOn(ImagePicker, 'openPickerSingle');

    const result = _openImagePicker({
      dispatch: jest.fn(),
      id: '1',
      fieldName: 'icon',
      uploadType: ResourceUploadType.userAvatar,
      destination: 'group',
      rootGroupId: '1',
    });
    expect(result).toBeTruthy();
    expect(spy).toBeCalled();
  });
});

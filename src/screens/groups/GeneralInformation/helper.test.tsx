import ImagePicker from 'react-native-image-crop-picker';

import { _openImagePicker } from './helper';

describe('GeneralInformation helper', () => {
  it('should _openImagePicker success', () => {
    const spy = jest.spyOn(ImagePicker, 'openPicker');

    const result = _openImagePicker({
      dispatch: jest.fn(),
      id: '1',
      fieldName: 'icon',
      uploadType: 'user_avatar',
      destination: 'group',
      rootGroupId: '1',
    });
    expect(result).toBeTruthy();
    expect(spy).toBeCalled();
  });
});

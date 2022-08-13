import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ImagePicker from '~/beinComponents/ImagePicker';
import modalActions from '~/storeRedux/modal/actions';

import { _openImagePicker, alertAction } from './helper';

describe('GeneralInformation helper', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it('should _openImagePicker success', () => {
    Platform.OS = 'web';
    const spy = jest.spyOn(ImagePicker, 'openPickerSingle');

    const result = _openImagePicker(jest.fn(), 1, 'icon', 'user_avatar');
    expect(result).toBeTruthy();
    expect(spy).toBeCalled();
  });

  it('should alertAction', () => {
    const theme: ExtendedTheme = useTheme();
    const spy = jest.spyOn(modalActions, 'showAlert');

    alertAction(jest.fn(), theme, 'test title', 'test content', jest.fn());
    expect(spy).toBeCalled();
  });
});

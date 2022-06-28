import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import uploadImage from './uploadImage';
import menuActions from '../actions';
import * as modalActions from '~/store/modal/actions';
import ImageUploader from '~/services/imageUploader';
import {uploadTypes} from '~/configs/resourceConfig';

describe('Update User Profile Image Saga', () => {
  const action = {
    type: 'test',
    payload: {
      id: 58,
      fieldName: 'avatar',
      uploadType: uploadTypes.userAvatar,
      file: {
        filename: '04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
        height: 200,
        mime: 'image/jpeg',
        name: '04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
        size: 18014,
        type: 'image/jpeg',
        uri: '/Users/quyenthu/Library/Developer/CoreSimulator/Devices/91A76299-6937-435C-AFF3-F2E7E62E2E78/data/Containers/Data/Application/D07EC89C-5E4F-4A8D-9034-09EB23482540/tmp/react-native-image-crop-picker/04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
        width: 200,
      },
    },
  };

  it('should request to upload avatar successfully', () => {
    const avatar =
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/4a8c0ce3-0813-4387-9547-eadcd7fee38b.jpg';
    const expectData = {
      id: 58,
      avatar: avatar,
    };

    jest.spyOn(ImageUploader, 'getInstance').mockImplementation(() => {
      return {upload: jest.fn().mockResolvedValue({url: avatar})} as any;
    });

    const fileUploader = ImageUploader.getInstance();
    //@ts-ignore
    return expectSaga(uploadImage, action)
      .put(menuActions.setLoadingAvatar(true))
      .provide([[matchers.call.fn(fileUploader.upload), avatar]])
      .put(menuActions.editMyProfile(expectData))
      .run();
  });

  it('should request to upload cover photo successfully', () => {
    const coverPhotoAction = {
      type: 'test',
      payload: {
        id: 58,
        fieldName: 'background_img_url',
        uploadType: uploadTypes.userCover,
        file: {
          filename: '04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
          height: 200,
          mime: 'image/jpeg',
          name: '04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
          size: 18014,
          type: 'image/jpeg',
          uri: '/Users/quyenthu/Library/Developer/CoreSimulator/Devices/91A76299-6937-435C-AFF3-F2E7E62E2E78/data/Containers/Data/Application/D07EC89C-5E4F-4A8D-9034-09EB23482540/tmp/react-native-image-crop-picker/04A144B0-F231-421F-B59F-C6AFF0DE0D94.jpg',
          width: 200,
        },
      },
    };
    const background_img_url =
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/4a8c0ce3-0813-4387-9547-eadcd7fee38b.jpg';
    const expectData = {
      id: 58,
      background_img_url: background_img_url,
    };

    jest.spyOn(ImageUploader, 'getInstance').mockImplementation(() => {
      return {
        upload: jest.fn().mockResolvedValue({url: background_img_url}),
      } as any;
    });

    const fileUploader = ImageUploader.getInstance();
    //@ts-ignore
    return expectSaga(uploadImage, coverPhotoAction)
      .put(menuActions.setLoadingCover(true))
      .provide([[matchers.call.fn(fileUploader.upload), background_img_url]])
      .put(menuActions.editMyProfile(expectData))
      .run();
  });

  it('should request to upload image failure', () => {
    const error = {meta: {message: 'Something went wrong'}};

    jest.spyOn(ImageUploader, 'getInstance').mockImplementation(() => {
      return {
        upload: jest.fn().mockRejectedValue(false),
      } as any;
    });

    const fileUploader = ImageUploader.getInstance();
    //@ts-ignore
    return expectSaga(uploadImage, action)
      .put(menuActions.setLoadingAvatar(true))
      .provide([[matchers.call.fn(fileUploader.upload), Promise.reject(error)]])
      .put(menuActions.setLoadingAvatar(false))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run();
  });
});

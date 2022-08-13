/* eslint-disable @typescript-eslint/ban-ts-comment */
import i18next from 'i18next';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';

import editMyProfile from './editMyProfile';
import menuActions from '../actions';
import menuDataHelper from '../../../screens/Menu/helper/MenuDataHelper';
import * as modalActions from '../../modal/actions';
import { mapProfile } from '../helper';

afterEach(cleanup);

describe('Update User Profile Saga', () => {
  const action = {
    type: 'test',
    payload: { id: '58', description: 'Fake fake description' },
  };

  it('should request to update user profile successfully', () => {
    const expectData = {
      code: 200,
      data: {
        id: 58,
        description: 'Fake fake description',
      },
      meta: {},
    };
    // @ts-ignorets
    return expectSaga(editMyProfile, action)
      .provide([[matchers.call.fn(menuDataHelper.editMyProfile), expectData]])
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_edit_success',
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(menuActions.setMyProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to update user avatar to user profile successfully', () => {
    const actionUpdateAvatar = {
      type: 'test',
      payload: {
        id: '58',
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/27f0c878-ac63-4cfe-99f9-793d360dce54.png',
      },
    };
    const expectData = {
      code: 200,
      data: {
        id: '58',
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/27f0c878-ac63-4cfe-99f9-793d360dce54.png',
      },
      meta: {},
    };
    return expectSaga(editMyProfile, actionUpdateAvatar)
      .provide([[matchers.call.fn(menuDataHelper.editMyProfile), expectData]])
      .put(
        modalActions.showHideToastMessage({
          content: 'common:avatar_changed',
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(menuActions.setMyProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to update user cover photo to user profile successfully', () => {
    const actionUpdateCoverPhoto = {
      type: 'test',
      payload: {
        id: '58',
        backgroundImgUrl:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/27f0c878-ac63-4cfe-99f9-793d360dce54.png',
      },
    };
    const expectData = {
      code: 200,
      data: {
        id: '58',
        backgroundImgUrl:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/27f0c878-ac63-4cfe-99f9-793d360dce54.png',
      },
      meta: {},
    };
    return expectSaga(editMyProfile, actionUpdateCoverPhoto)
      .provide([[matchers.call.fn(menuDataHelper.editMyProfile), expectData]])
      .put(
        modalActions.showHideToastMessage({
          content: 'common:cover_changed',
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(menuActions.setMyProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to update user profile successfully and show toast with custom content', () => {
    const expectData = {
      code: 200,
      data: {
        id: 58,
        description: 'Fake fake description',
      },
      meta: {},
    };
    const editFieldToastMessage = 'common:btn_update';

    return expectSaga(editMyProfile, { ...action, editFieldToastMessage })
      .provide([[matchers.call.fn(menuDataHelper.editMyProfile), expectData]])
      .put(
        modalActions.showHideToastMessage({
          content: editFieldToastMessage,
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .put(menuActions.setMyProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to update user profile fail', () => {
    const error = { meta: { message: 'Something went wrong' } };
    return expectSaga(editMyProfile, action)
      .provide([
        [matchers.call.fn(menuDataHelper.editMyProfile), Promise.reject(error)],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.message,
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .put(menuActions.setLoadingAvatar(false))
      .put(menuActions.setLoadingCover(false))
      .run();
  });

  it('should request to update user profile fail bc This Email is used', () => {
    const error = { meta: { message: 'This Email is used' } };
    return expectSaga(editMyProfile, action)
      .provide([
        [matchers.call.fn(menuDataHelper.editMyProfile), Promise.reject(error)],
      ])
      .put(
        menuActions.setEmailEditError(i18next.t('settings:text_email_is_used')),
      )
      .put(menuActions.setLoadingAvatar(false))
      .put(menuActions.setLoadingCover(false))
      .run();
  });

  it('should request to update user profile fail bc This phone number is used', () => {
    const error = { meta: { message: 'This phone number is used' } };
    return expectSaga(editMyProfile, action)
      .provide([
        [matchers.call.fn(menuDataHelper.editMyProfile), Promise.reject(error)],
      ])
      .put(
        menuActions.setPhoneNumberEditError(
          i18next.t('settings:text_phone_number_is_used'),
        ),
      )
      .put(menuActions.setLoadingAvatar(false))
      .put(menuActions.setLoadingCover(false))
      .run();
  });
});

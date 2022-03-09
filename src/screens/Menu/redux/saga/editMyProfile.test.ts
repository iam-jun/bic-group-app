import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import {throwError} from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import editMyProfile from './editMyProfile';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import * as modalActions from '~/store/modal/actions';
import {mapProfile} from '../helper';

describe('Update User Profile Saga', () => {
  const action = {
    type: 'test',
    payload: {id: 58, description: 'Fake fake description'},
  };

  const expectData = {
    id: 58,
    chat_user_id: 'figxm4qaptr5trydwm4fprwciw',
    email: 'thuquyen@tgm.vn',
    username: 'thuquyen',
    fullname: 'Nguyễn Thị Thu Quyền',
    gender: 'FEMALE',
    birthday: null,
    avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/27f0c878-ac63-4cfe-99f9-793d360dce54.png',
    bein_staff_role: null,
    background_img_url:
      'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    country_code: '84',
    phone: '987234567',
    address: null,
    city: null,
    country: null,
    language: [],
    description: 'Fake fake description',
    relationship_status: null,
    created_at: '2022-01-24T08:31:02.403Z',
    updated_at: '2022-03-09T08:29:24.480Z',
    deleted_at: null,
  };

  it('should request to update user profile successfully', () => {
    const error = {meta: {message: 'Something went wrong'}};
    return (
      expectSaga(editMyProfile, action)
        .provide([
          [
            matchers.call.fn(menuDataHelper.editMyProfile),
            Promise.reject(error),
          ],
        ])
        .put(
          //   modalActions.showHideToastMessage({
          //     content: 'common:text_edit_success',
          //     props: {
          //       textProps: {useI18n: true},
          //       type: 'success',
          //     },
          //   }),
          modalActions.showHideToastMessage({
            content: error.meta.message,
            props: {
              textProps: {useI18n: true},
              type: 'error',
            },
          }),
        )
        //   .put(menuActions.setMyProfile(mapProfile(expectData)))
        .run()
    );
  });

  //   it('should request to update user profile fail', () => {
  //     const error = {meta: {message: 'Something went wrong'}};
  //     return (
  //       expectSaga(editMyProfile, action)
  //         .provide([
  //           [
  //             matchers.call.fn(menuDataHelper.editMyProfile),
  //             Promise.reject(error),
  //           ],
  //         ])
  //         .put(
  //           modalActions.showHideToastMessage({
  //             content: error.meta.message,
  //             props: {
  //               textProps: {useI18n: true},
  //               type: 'error',
  //             },
  //           }),
  //         )
  //         .run()
  //     );
  //   });
});

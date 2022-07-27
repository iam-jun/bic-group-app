import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {cleanup} from '@testing-library/react-native';

import getMyProfile from './getMyProfile';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {mapProfile} from '../helper';

describe('Get My Profile Saga', () => {
  const action = {
    type: 'test',
    payload: {userId: 58},
  };

  const state = {
    menu: {
      myProfile: {
        address: undefined,
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/f00fc177-ab14-4f37-9496-6241263bb362.jpg',
        backgroundImgUrl:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/cover/images/original/9b7c23c6-b337-42ac-b084-c52843fceeb5.jpg',
        beinStaffRole: undefined,
        birthday: '1976-03-01T17:00:00.000Z',
        chatUserId: 'ryrzufdkg3g4bg3u3b51p7fyrh',
        city: 'Bà Rịa - Vũng Tàu',
        country: 'Việt Nam',
        country_code: '84',
        createdAt: '2022-01-24T08:35:17.801Z',
        deletedAt: null,
        description:
          'Aloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo00qqqqqqqqqq6666666',
        email: 'thuquyen@tgm.vn',
        fullname: 'Nguyen Thi Thu Quyền',
        gender: 'FEMALE',
        id: '58',
        language: ['vi', 'en'],
        latest_work: {company: 'test 1', title_position: 'test 1'},
        phone: '89871234',
        relationship_status: 'SINGLE',
        updatedAt: '2022-03-11T10:23:30.864Z',
        username: 'thuquyen',
      },
    },
  };

  it('should request to get My Profile successfully', () => {
    const expectData = {
      code: 200,
      data: {
        id: 58,
        email: 'email',
        fullname: 'fullname',
        username: 'username',
      },
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(getMyProfile, action)
      .withState(state)
      .provide([[matchers.call.fn(menuDataHelper.getUserProfile), expectData]])
      .put(menuActions.setMyProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to get My Profile failure', () => {
    const error = {meta: {message: 'Something when wrong!!!'}};
    // @ts-ignorets
    return expectSaga(getMyProfile, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(menuDataHelper.getUserProfile),
          Promise.reject(error),
        ],
      ])
      .put(menuActions.setMyProfile(state.menu.myProfile))
      .run();
  });
});

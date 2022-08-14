/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getUserProfile from './getUserProfile';
import menuActions from '../actions';
import { mapProfile } from '../helper';
import groupApi from "../../../api/GroupApi";

describe('Get User Profile Saga', () => {
  const action = {
    type: 'test',
    payload: { userId: 1 },
  };

  it('should request to getUserProfile successfully', () => {
    const expectData = {
      code: 200,
      data: {
        id: 1,
        email: 'email',
        fullname: 'fullname',
        username: 'username',
      },
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(getUserProfile, action)
      .provide([[matchers.call.fn(groupApi.getUserProfile), expectData]])
      .put(menuActions.setUserProfile(mapProfile(expectData.data)))
      .run();
  });

  it('should request to getUserProfile failure', () => {
    const error = { meta: { message: 'Something when wrong!!!' } };
    // @ts-ignorets
    return expectSaga(getUserProfile, action)
      .provide([
        [
          matchers.call.fn(groupApi.getUserProfile),
          Promise.reject(error),
        ],
      ])
      .put(menuActions.setUserProfile(null))
      .put(menuActions.setShowUserNotFound())
      .run();
  });
});

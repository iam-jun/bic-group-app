/* eslint-disable @typescript-eslint/no-var-requires */
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import signIn from './signIn';
import actions from '../actions';
import {throwError} from 'redux-saga-test-plan/providers';
import {Auth} from 'aws-amplify';
import notificationsActions from '~/screens/Notification/redux/actions';

describe('signIn Saga', () => {
  let Platform: any;
  const action = {
    type: 'test',
    payload: {
      email: 'foo@bar',
      password: 'password',
    },
  };

  beforeEach(() => {
    Platform = require('react-native').Platform;
  });

  it('signIn should be called to server failure', () => {
    return expectSaga(signIn, action)
      .provide([
        [
          matchers.call.fn(Auth.signIn),
          //@ts-ignore
          throwError({code: 'NotAuthorizedException'}),
        ],
      ])
      .put(actions.setLoading(true))
      .put(actions.setSigningInError(''))
      .put(actions.setSigningInError(`Authentication Error`))
      .run();
  });

  it('signIn should call savePushToken on mobile', () => {
    Platform.OS = 'ios';
    return expectSaga(signIn, action)
      .provide([[matchers.call.fn(Auth.signIn), null]])
      .put(actions.setLoading(true))
      .put(notificationsActions.savePushToken(''))
      .run();
  });
});

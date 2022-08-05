/* eslint-disable @typescript-eslint/no-var-requires */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { Auth } from 'aws-amplify';
import signIn from './signIn';
import actions from '../actions';
import notificationsActions from '~/screens/Notification/redux/actions';
import { authErrors } from '~/constants/authConstants';

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
    jest.spyOn(Auth, 'signIn').mockImplementation(() => Promise.reject({
      code: authErrors.NOT_AUTHORIZED_EXCEPTION,
    }));

    return expectSaga(signIn, action)
      .put(actions.setLoading(true))
      .put(actions.setSigningInError(''))
      .put(notificationsActions.savePushToken(''))
      .provide([
        [
          matchers.call.fn(Auth.signIn),
          Promise.reject({ code: authErrors.LIMIT_EXCEEDED_EXCEPTION }),
        ],
      ])
      .put(actions.setLoading(false))
      .put(actions.setSigningInError('Email and password doesn\'t match.'))
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

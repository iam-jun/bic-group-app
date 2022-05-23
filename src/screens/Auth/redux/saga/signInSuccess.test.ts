/* eslint-disable @typescript-eslint/no-var-requires */
import {expectSaga} from 'redux-saga-test-plan';
import {IUserResponse} from '~/interfaces/IAuth';
import modalActions from '~/store/modal/actions';
import actions from '../actions';
import signInSuccess from './signInSuccess';

describe('signInSuccess Saga', () => {
  const user: IUserResponse = {
    id: '1',
    username: 'foo',
    email: 'foo@bar',
    name: 'foo',
    role: 'user',
    signInUserSession: undefined,
    attributes: {},
  };
  const action = {
    type: 'test',
    payload: user,
  };

  it('signInSuccess should be call loading', () => {
    return expectSaga(signInSuccess, action)
      .put(modalActions.showLoading())
      .put(
        actions.setUser({
          username: 'foo',
          signInUserSession: {},
          attributes: {},
          name: '',
          email: '',
          id: 'foo',
          role: 'foo',
        } as IUserResponse),
      )
      .run();
  });
});

/* eslint-disable @typescript-eslint/no-var-requires */
import {expectSaga} from 'redux-saga-test-plan';
import modalActions from '~/store/modal/actions';
import actions from '../actions';
import signInSuccess from './signInSuccess';

describe('signInSuccess Saga', () => {
  const user: any = {
    id: '1',
    username: 'foo',
    email: 'foo@bar',
    name: 'foo',
    role: 'user',
  };
  const action = {
    type: 'test',
    payload: user,
  };

  it('signInSuccess should be call loading', () => {
    return (
      //@ts-ignore
      expectSaga(signInSuccess, action)
        .put(modalActions.showLoading())
        .put(
          actions.setUser({
            username: 'foo',

            //@ts-ignore
            signInUserSession: {},
            attributes: {},
            name: '',
            email: '',
            id: 'foo',
            role: 'foo',
          }),
        )
        .put(modalActions.hideLoading())
        .run()
    );
  });
});

import {delay, put} from 'redux-saga/effects';
import {IObject} from '~/interfaces/common';
import {IUserResponse} from '~/interfaces/IAuth';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {rootSwitch} from '~/router/stack';
import {
  getUserFromSharedPreferences,
  saveUserToSharedPreferences,
} from '~/services/sharePreferences';
import * as modalActions from '~/store/modal/actions';
import actions from '../actions';

const navigation = withNavigation(rootNavigationRef);

export default function* signInSuccess({
  payload,
}: {
  type: string;
  payload: IUserResponse;
}): any {
  yield put(modalActions.showLoading());

  const name =
    payload?.attributes?.name?.length < 50
      ? payload?.attributes?.name
      : payload?.attributes?.email?.match?.(/^([^@]*)@/)[1];

  const userResponse: IUserResponse = {
    username: payload?.username || '',
    signInUserSession: payload?.signInUserSession || {},
    attributes: payload?.attributes || {},
    name: name || '',
    email: payload?.attributes?.email || '',

    id: payload?.username,
    role: payload?.username,
  };
  const sessionData: IObject<any> = yield getUserFromSharedPreferences();
  const activeSessions = sessionData?.activeSessions || [];
  //For sharing data between Group and Chat
  yield saveUserToSharedPreferences({
    username: userResponse.username,
    email: userResponse.email,
    name,
    token: userResponse.signInUserSession.idToken?.jwtToken,
    exp: userResponse.signInUserSession.idToken?.payload?.exp,
    activeSessions: [...activeSessions, 'community'],
  });

  yield put(actions.setUser(userResponse));

  navigation.replace(rootSwitch.mainStack);
  yield put(actions.setLoading(false));
  yield delay(500); // Delay to avoid showing authStack
  yield put(modalActions.hideLoading());
}

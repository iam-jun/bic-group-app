import {
  put, select, takeEvery,
} from 'redux-saga/effects';
import notificationsActions from '~/storeRedux/notification/actions';
import notificationsTypes from '~/storeRedux/notification/types';
import { makePushTokenRequest } from '~/api/apiRequest';
import { initPushTokenMessage } from '~/services/firebase';

export default function* notificationsSaga() {
  yield takeEvery(
    notificationsTypes.REGISTER_PUSH_TOKEN, registerPushToken,
  );
}

// register push token
function* registerPushToken({ payload }: any): any {
  try {
    const { notifications } = yield select();
    const savedToken = notifications?.pushToken;

    const messaging: any = yield initPushTokenMessage();
    const newToken: string = payload?.token || (yield messaging().getToken());

    if (!!savedToken && newToken === savedToken) {
      // if current token same as new token, just skip
      return;
    }

    // when initPushTokenMessage, onTokenRefresh will be called
    // save token first to avoid call backend multiple times
    yield put(notificationsActions.savePushToken(newToken));
    yield makePushTokenRequest(newToken);
  } catch (e) {
    yield put(notificationsActions.savePushToken(''));
    console.error(
      'register push token failed', e,
    );
  }
}

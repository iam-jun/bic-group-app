import { call, put } from 'redux-saga/effects';

import { IResponseData } from '~/interfaces/common';
import { IGetUserProfile } from '~/interfaces/IAuth';
import menuDataHelper from '../../../screens/Menu/helper/MenuDataHelper';
import menuActions from '../actions';
import { mapProfile } from '../helper';

export default function* getUserProfile({
  payload,
}: {
  type: string;
  payload: IGetUserProfile;
}) {
  const { userId, params } = payload;
  try {
    const response: IResponseData = yield call(
      menuDataHelper.getUserProfile,
      userId,
      params,
    );

    yield put(menuActions.setUserProfile(mapProfile(response.data)));
  } catch (err) {
    yield put(menuActions.setUserProfile(null));
    yield put(menuActions.setShowUserNotFound());
    console.error('getUserProfile error:', err);
  }
}

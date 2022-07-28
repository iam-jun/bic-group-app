import { call, put, select } from 'redux-saga/effects';

import { IResponseData } from '~/interfaces/common';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import { mapProfile } from '../helper';

export default function* getMyProfile({
  payload,
}: {
  type: string;
  payload: IGetUserProfile;
}) {
  const { menu } = yield select();
  const { myProfile } = menu;
  const { userId, params } = payload;

  try {
    const response: IResponseData = yield call(
      menuDataHelper.getUserProfile,
      userId,
      params,
    );
    yield updateUserFromSharedPreferences({
      name: response?.data?.fullname,
      avatar: response?.data?.avatar,
    });
    yield put(menuActions.setMyProfile(mapProfile(response.data)));
  } catch (err) {
    yield put(menuActions.setMyProfile(myProfile));
    console.error(
      'getMyProfile error:', err,
    );
  }
}

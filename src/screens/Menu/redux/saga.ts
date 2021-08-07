import {put, takeLatest} from 'redux-saga/effects';
import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IUserProfile} from '~/interfaces/IAuth';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
}

function* getUserProfile() {
  try {
    yield put(menuActions.setLoadingUserProfile(true));

    const result: IUserProfile = yield requestUserProfile();
    yield put(menuActions.setUserProfile(result));

    yield put(menuActions.setLoadingUserProfile(false));
  } catch (err) {
    yield put(menuActions.setLoadingUserProfile(false));
    console.log('getUserProfile error:', err);
  }
}

const requestUserProfile = async () => {
  try {
    const response = await menuDataHelper.getMyProfile();

    if (response.code === 200 && response.data) {
      return response.data;
    }
  } catch (err) {
    console.log('requestUserProfile error:', err);
  }
};

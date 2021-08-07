import {put, takeLatest} from 'redux-saga/effects';
import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper, {
  mapBasicInfoData,
} from '~/screens/Menu/helper/MenuDataHelper';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
}

function* getUserProfile() {
  try {
    yield put(menuActions.setLoadingUserProfile(true));

    const result = yield requestUserProfile();
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
      const data = response.data;
      const result = mapBasicInfoData(data);
      return result;
    }
  } catch (err) {
    console.log('requestUserProfile error:', err);
  }
};

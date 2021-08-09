import {select, put, takeLatest} from 'redux-saga/effects';
import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IUserProfile} from '~/interfaces/IAuth';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.SELECT_USER_PROFILE, selectUserProfile);
}

function* getUserProfile() {
  const {userProfile} = yield select();
  try {
    const result: IUserProfile = yield requestUserProfile();
    yield put(menuActions.setUserProfile(result));
  } catch (err) {
    yield put(menuActions.setUserProfile(userProfile));
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

function* selectUserProfile({payload}: {payload: IUserProfile; type: string}) {
  try {
    // TODO: will need to add userId option when we have
    // a new API to get info for any user
    // currently we temporarily use get-my-profile API
    yield put(menuActions.getUserProfile());
  } catch (err) {
    console.log('selectUserProfile error ---> ', err);
  }
}

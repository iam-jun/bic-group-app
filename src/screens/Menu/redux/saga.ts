import {select, put, takeLatest} from 'redux-saga/effects';
import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IUserProfile} from '~/interfaces/IAuth';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.SELECT_USER_PROFILE, selectUserProfile);
}

function* getUserProfile({payload}: {type: string; payload: number}) {
  const {userProfile} = yield select();
  try {
    const result: IUserProfile = yield requestUserProfile(payload);
    yield put(menuActions.setUserProfile(result));
  } catch (err) {
    yield put(menuActions.setUserProfile(userProfile));
    console.log('getUserProfile error:', err);
  }
}

const requestUserProfile = async (userId: number) => {
  try {
    const response = await menuDataHelper.getMyProfile(userId);

    if (response.code === 200 && response.data) {
      return response.data;
    }
  } catch (err) {
    console.log('requestUserProfile error:', err);
  }
};

function* selectUserProfile({payload}: {payload: IUserProfile; type: string}) {
  try {
    yield put(menuActions.getUserProfile(payload.id));
  } catch (err) {
    console.log('selectUserProfile error ---> ', err);
  }
}

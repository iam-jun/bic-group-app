import {select, put, takeLatest} from 'redux-saga/effects';
import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IUserProfile, IUserEdit} from '~/interfaces/IAuth';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_MY_PROFILE, getMyProfile);
  yield takeLatest(menuTypes.SELECT_MY_PROFILE, selectMyProfile);
  yield takeLatest(menuTypes.GET_SELECTED_PROFILE, getSelectedProfile);
  yield takeLatest(menuTypes.SELECTED_PROFILE, selectPublicProfile);
  yield takeLatest(menuTypes.EDIT_MY_PROFILE, editMyProfile);
}

function* getMyProfile({payload}: {type: string; payload: number}) {
  const {myProfile} = yield select();
  try {
    const result: IUserProfile = yield requestUserProfile(payload);
    yield put(
      menuActions.setMyProfile({...result, language: result.language || []}),
    );
  } catch (err) {
    yield put(menuActions.setMyProfile(myProfile));
    console.log('getMyProfile error:', err);
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

function* selectMyProfile({payload}: {payload: IUserProfile; type: string}) {
  try {
    yield put(menuActions.getMyProfile(payload.id));
  } catch (err) {
    console.log('selectMyProfile error ---> ', err);
  }
}

function* getSelectedProfile({payload}: {type: string; payload: number}) {
  const {selectedProfile} = yield select();
  try {
    const result: IUserProfile = yield requestUserProfile(payload);
    yield put(menuActions.setSelectedProfile(result));
  } catch (err) {
    yield put(menuActions.setSelectedProfile(selectedProfile));
    console.log('getMyProfile error:', err);
  }
}

function* selectPublicProfile({
  payload,
}: {
  payload: IUserProfile;
  type: string;
}) {
  try {
    yield put(menuActions.getSelectedProfile(payload.id));
  } catch (err) {
    console.log('selectPublicProfile error ---> ', err);
  }
}

function* editMyProfile({payload}: {type: string; payload: IUserEdit}) {
  try {
    const result = yield requestEditMyProfile(payload);
    yield put(
      menuActions.setMyProfile({...result, language: result.language || []}),
    );
  } catch (error) {
    console.log('\x1b[33m', 'editMyProfile : error', error, '\x1b[0m');
  }
}

const requestEditMyProfile = async (data: IUserEdit) => {
  try {
    const userId = data.id;
    delete data.id; // edit data should not contain user's id

    const response = await menuDataHelper.editMyProfile(userId, data);
    if (response.code === 200) {
      return response.data;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'requestEditMyProfile catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};

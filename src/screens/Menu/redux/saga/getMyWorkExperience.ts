import { put, call } from 'redux-saga/effects';
import { IResponseData } from '~/interfaces/common';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import { mapWorkExperience } from '../helper';

export default function* getMyWorkExperience() {
  try {
    const response: IResponseData = yield call(menuDataHelper.getMyWorkExperience);
    yield put(menuActions.setMyWorkExperience(mapWorkExperience(response?.data)));
  } catch (err) {
    console.error('getMyWorkExperience error:', err);
  }
}

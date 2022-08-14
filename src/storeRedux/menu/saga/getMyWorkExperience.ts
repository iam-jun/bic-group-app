import { put, call } from 'redux-saga/effects';
import { IResponseData } from '~/interfaces/common';
import menuActions from '../actions';
import { mapWorkExperience } from '../helper';
import groupApi from '~/api/GroupApi';

export default function* getMyWorkExperience() {
  try {
    const response: IResponseData = yield call(groupApi.getMyWorkExperience);
    yield put(menuActions.setMyWorkExperience(mapWorkExperience(response?.data)));
  } catch (err) {
    console.error('getMyWorkExperience error:', err);
  }
}

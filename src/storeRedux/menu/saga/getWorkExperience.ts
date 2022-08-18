import { put, call } from 'redux-saga/effects';
import { IResponseData } from '~/interfaces/common';
import menuActions from '../actions';
import { mapWorkExperience } from '../helper';
import groupApi from '~/api/GroupApi';

export default function* getWorkExperience({ payload }: {type: string; payload: string}) {
  try {
    const response: IResponseData = yield call(
      groupApi.getWorkExperience,
      payload,
    );
    yield put(menuActions.setUserWorkExperience(mapWorkExperience(response.data)));
  } catch (err) {
    console.error(
      'getWorkExperience error:', err,
    );
  }
}

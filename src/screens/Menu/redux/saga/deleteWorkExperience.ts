import { put, call } from 'redux-saga/effects';

import { IResponseData } from '~/interfaces/common';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import { mapWorkExperience } from '../helper';
import showError from '~/store/commonSaga/showError';

export default function* deleteWorkExperience({
  id,
  callback,
}: {
  type: string;
  id: number;
  callback?: () => void;
}) {
  try {
    const response: IResponseData = yield call(
      menuDataHelper.deleteWorkExperience,
      id,
    );

    if (response?.data) {
      yield put(
        menuActions.setMyWorkExperience(mapWorkExperience(response.data)),
      );
    }
    if (callback) return callback();
  } catch (err) {
    console.error('deleteWorkExperience:', err);
    yield showError(err);
  }
}

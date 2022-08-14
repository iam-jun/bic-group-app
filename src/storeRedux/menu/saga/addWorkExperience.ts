import { put, call } from 'redux-saga/effects';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';
import menuActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';

export default function* addWorkExperience({
  payload,
  callback,
}: {
  type: string;
  payload: IUserAddWorkExperience;
  callback?: () => void;
}) {
  try {
    const {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    } = payload;

    yield call(groupApi.addWorkExperience, {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    });

    yield put(menuActions.getMyWorkExperience());

    if (callback) return callback();
  } catch (err) {
    console.error(
      'addWorkExperience:', err,
    );
    yield showError(err);
  }
}

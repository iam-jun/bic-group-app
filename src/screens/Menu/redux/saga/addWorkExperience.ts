import { put, call } from 'redux-saga/effects';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import showError from '~/store/commonSaga/showError';

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

    yield call(menuDataHelper.addWorkExperience, {
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
    console.error('addWorkExperience:', err);
    yield showError(err);
  }
}

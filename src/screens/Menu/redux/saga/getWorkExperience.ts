import {put, call} from 'redux-saga/effects';
import {IResponseData} from '~/interfaces/common';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import {mapWorkExperience} from '../helper';

export default function* getWorkExperience({id}: {id: number}) {
  try {
    const response: IResponseData = yield call(
      menuDataHelper.getWorkExperience,
      id,
    );
    if (response?.data) {
      yield put(
        menuActions.setUserWorkExperience(mapWorkExperience(response.data)),
      );
    }
  } catch (err) {
    console.log('getWorkExperience error:', err);
  }
}

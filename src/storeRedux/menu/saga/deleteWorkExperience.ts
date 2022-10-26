import { put, call } from 'redux-saga/effects';

import { IResponseData } from '~/interfaces/common';
import menuActions from '../actions';
import { mapWorkExperience } from '../helper';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';

export default function* deleteWorkExperience({
  id,
  callback,
}: {
  type: string;
  id: string;
  callback?: () => void;
}) {
  try {
    const response: IResponseData = yield call(
      groupApi.deleteWorkExperience,
      id,
    );

    if (response?.data) {
      yield put(menuActions.setUserWorkExperience(mapWorkExperience(response.data)));
      const userId = useUserProfileStore.getState().data.id;
      useUserProfileStore.getState().actions.getUserProfile({ userId, silentLoading: true });
    }
    if (callback) return callback();
  } catch (err) {
    console.error(
      'deleteWorkExperience:', err,
    );
    yield showError(err);
  }
}

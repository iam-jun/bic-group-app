import { call, put, select } from 'redux-saga/effects';

import { ICommunityDetailEdit } from '~/interfaces/ICommunity';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';
import showToastEditSuccess from './showToastEditSuccess';

export default function* editCommunityDetail({
  payload,
}: {
  type: string;
  payload: {
    data: ICommunityDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  };
}) {
  const { data, editFieldName, callback } = payload;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resp = yield call(
      groupApi.editCommunityDetail,
      data.id,
      data,
    );

    if (resp?.data) {
      const { communityDetail } = yield select((state) => state?.groups) || {};
      yield put(groupsActions.setCommunityDetail({ ...communityDetail, ...resp.data }));
    }

    if (editFieldName) yield showToastEditSuccess(editFieldName);

    if (callback) callback();
  } catch (err) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m',
    );
    yield showError(err);
    // just in case there is some error regarding editing images url
    yield put(groupsActions.setLoadingAvatar(false));
    yield put(groupsActions.setLoadingCover(false));
  }
}

import { put, select } from 'redux-saga/effects';
import groupsActions from '~/screens/Groups/redux/actions';

export default function* mergeExtraGroupPosts({
  payload,
}: {
  type: string;
  payload: string;
}) {
  const { groups } = yield select();
  const { canLoadMore, loading } = groups?.posts || {};
  if (!loading && canLoadMore) {
    yield put(groupsActions.getGroupPosts(payload));
  }
}

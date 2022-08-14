import { put, select } from 'redux-saga/effects';
import groupsActions from '~/storeRedux/groups/actions';

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

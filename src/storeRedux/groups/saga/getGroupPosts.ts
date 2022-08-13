import { put, select, call } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import { IParamGetGroupPosts } from '~/interfaces/IGroup';
import postActions from '~/storeRedux/post/actions';
import groupsDataHelper from '../../../api/GroupsDataHelper';
import groupsActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';

export default function* getGroupPosts({
  payload,
}: {
  type: string;
  payload: string;
}): any {
  try {
    const { groups } = yield select();
    const { offset, data } = groups.posts;

    const param: IParamGetGroupPosts = { groupId: payload, offset };
    const response = yield call(groupsDataHelper.getGroupPosts, param);

    const result = response.data?.list;
    yield put(postActions.addToAllPosts({ data: result }));
    if (data.length === 0) {
      yield put(groupsActions.setGroupPosts(result));
      if (result.length === appConfig.recordsPerPage) {
        yield put(groupsActions.getGroupPosts(payload));
      }
    } else {
      yield put(groupsActions.setExtraGroupPosts(result));
    }

    yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    yield put(groupsActions.setLoadingPage(false));
    console.error(
      '\x1b[33m',
      'getGroupPosts : error',
      e,
      '\x1b[0m',
    );
    yield showError(e);
  }
}

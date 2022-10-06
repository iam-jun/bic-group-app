import { put, select, call } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import { IParamGetGroupPosts } from '~/interfaces/IGroup';
import groupApi from '../../../api/GroupApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import groupsActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import usePostsStore from '~/store/entities/posts';

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
    const response = yield call(groupApi.getGroupPosts, param);

    const result = response.data?.list;
    usePostsStore.getState().actions.addToPosts({ data: result } as IPayloadAddToAllPost);
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

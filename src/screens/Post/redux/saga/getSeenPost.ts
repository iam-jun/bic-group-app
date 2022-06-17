import {
  ICommentData,
  IPayloadGetCommentsById,
  IReaction,
  IAudienceUser,
  ISeenUserList,
  IGetSeenPostListSheet,
} from '~/interfaces/IPost';
import {call, put, select} from 'redux-saga/effects';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import addChildCommentToCommentsOfPost from '~/screens/Post/redux/saga/addChildCommentToCommentsOfPost';
import postActions from '~/screens/Post/redux/actions';
import showError from '~/store/commonSaga/showError';
import PostViewDraft from '../../components/PostViewDraft';
import {concat} from 'lodash';

function* getSeenPost({payload}: {postId: number; offset: number}): any {
  try {
    const {data, canLoadMore, loading} = yield select(
      state => state?.post?.seenPostList,
    ) || {};
    const params = {
      postId: payload.postId,
      offset: data.length,
    };

    const response = yield call(postDataHelper.getSeenList, params);

    const newData = response ? response.data : undefined;
    const {list, meta} = newData;
    const dataList = data.concat(list);
    const payloadSet = {
      data: dataList,
      total: meta.total,
      canLoadMore: meta.hasNextPage,
    };
    yield put(postActions.setSeenPost(payloadSet));
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getCommentsByPostId error: `, e, `\x1b[0m`);
    yield showError(e);
  }
}

export default getSeenPost;

import {
  ICommentData,
  IPayloadAddToAllPost,
  IPostActivity,
} from '~/interfaces/IPost';
import {put, select} from 'redux-saga/effects';
import {isArray} from 'lodash';
import postActions from '~/screens/Post/redux/actions';
import {sortComments} from '~/screens/Post/helper/PostUtils';

function* addToAllPosts({
  payload,
}: {
  type: string;
  payload: IPayloadAddToAllPost;
}): any {
  const {data, handleComment} = payload || {};
  const allPosts = yield select(state => state?.post?.allPosts) || {};
  const newAllPosts = {...allPosts};
  const newAllCommentByParentId: any = {};
  let newComments: ICommentData[] = [];

  let posts: IPostActivity[] = [];
  if (isArray(data) && data.length > 0) {
    posts = posts.concat(data);
  } else {
    posts = new Array(data) as IPostActivity[];
  }

  posts.map((item: IPostActivity) => {
    if (item?.id) {
      if (handleComment) {
        const postComments = sortComments(item?.comments?.list || []);

        newAllCommentByParentId[item.id] = postComments;
        postComments.map((c: ICommentData) => {
          newComments.push(c);
          newComments = newComments.concat(c?.child?.list || []);
        });
      }
      newAllPosts[item.id] = item;
    }
  });
  if (handleComment) {
    yield put(postActions.addToAllComments(newComments));
    yield put(
      postActions.updateAllCommentsByParentIds(newAllCommentByParentId),
    );
  }
  yield put(postActions.setAllPosts(newAllPosts));
}

export default addToAllPosts;

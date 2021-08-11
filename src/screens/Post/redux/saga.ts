import {put, call, takeLatest, select} from 'redux-saga/effects';
import {isArray} from 'lodash';

import {
  IOwnReaction,
  IParamSearchMentionAudiences,
  IPayloadReactToPost,
  IPostActivity,
  IPostCreatePost,
  IReaction,
  IReactionCounts,
} from '~/interfaces/IPost';
import postTypes from '~/screens/Post/redux/types';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {withNavigation} from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ReactionType} from '~/constants/reactions';

const navigation = withNavigation(rootNavigationRef);

export default function* postSaga() {
  yield takeLatest(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
  yield takeLatest(
    postTypes.GET_SEARCH_MENTION_AUDIENCES,
    getSearchMentionAudiences,
  );
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
  yield takeLatest(postTypes.POST_REACT_TO_POST, postReactToPost);
  yield takeLatest(postTypes.DELETE_REACT_TO_POST, deleteReactToPost);
}

function* postCreateNewPost({
  payload,
}: {
  type: string;
  payload: IPostCreatePost;
}) {
  console.log(
    '\x1b[36m',
    'namanh --- postCreateNewPost | postCreateNewPost : ',
    '\x1b[0m',
    payload,
  );
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(postDataHelper.postCreateNewPost, payload);
    yield put(postActions.setLoadingCreatePost(false));
    if (response.data) {
      const postData: IPostActivity = response.data;
      yield put(postActions.addToAllPosts(postData));
      yield put(postActions.setPostDetail(postData));
      navigation.replace(homeStack.postDetail);
    } else {
      //todo handle post error
    }
  } catch (e) {
    console.log(
      '\x1b[33m',
      'namanh --- postCreateNewPost | postCreateNewPost catch: ',
      JSON.stringify(e, undefined, 2),
      '\x1b[0m',
    );
    yield put(postActions.setLoadingCreatePost(false));
  }
}

function* getSearchMentionAudiences({
  payload,
}: {
  type: string;
  payload: IParamSearchMentionAudiences;
}) {
  try {
    const response = yield call(
      postDataHelper.getSearchMentionAudiences,
      payload,
    );
    if (response?.data) {
      yield put(postActions.setMentionSearchResult(response?.data));
    }
  } catch (e) {
    console.log('\x1b[36m', '🐣️ searchMentionAudiences error:', e, '\x1b[0m');
  }
}

function* addToAllPosts({
  payload,
}: {
  type: string;
  payload: IPostActivity[] | IPostActivity;
}) {
  const allPosts = yield select(state => state?.post?.allPosts) || {};
  const newAllPosts = {...allPosts};
  if (isArray(payload) && payload.length > 0) {
    payload.map((item: IPostActivity) => {
      if (item?.id) {
        newAllPosts[item.id] = item;
      }
    });
  } else if (payload && 'id' in payload && payload.id) {
    newAllPosts[payload.id] = payload;
  }
  yield put(postActions.setAllPosts(newAllPosts));
}

function* onUpdateReactionOfPostById(
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
) {
  try {
    const allPosts = yield select(state => state?.post?.allPosts) || {};
    const post: IPostActivity = allPosts?.[postId] || {};
    post.reaction_counts = reactionCounts;
    post.own_reactions = ownReaction;
    allPosts[postId] = post;
    yield put(postActions.setAllPosts(allPosts));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* postReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}) {
  const {postId, reactionId, reactionCounts, ownReaction, userId} = payload;
  try {
    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = ownReaction?.[reactionId]?.length > 0;
    if (!added) {
      const newOwnReaction: IOwnReaction = {...ownReaction};
      const reactionArr: IReaction[] = [];
      reactionArr.push({kind: reactionId});
      newOwnReaction[reactionId] = reactionArr;
      const newReactionCounts = {...reactionCounts};
      newReactionCounts[reactionId] =
        (newReactionCounts?.[reactionId] || 0) + 1;
      yield onUpdateReactionOfPostById(
        postId,
        newOwnReaction,
        newReactionCounts,
      );

      const response = yield call(
        postDataHelper.postReaction,
        postId,
        'post',
        data,
        userId,
      );
      if (response?.data?.[0]) {
        const reactionArr2: IReaction[] = [];
        reactionArr2.push({id: response?.data?.[0]});
        newOwnReaction[reactionId] = reactionArr2;

        yield onUpdateReactionOfPostById(
          postId,
          newOwnReaction,
          newReactionCounts,
        );
      }
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(postId, ownReaction, reactionCounts); //rollback
    console.log('\x1b[31m', '🐣️ postReactToPost error : ', e, '\x1b[0m');
  }
}

function* deleteReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}) {
  const {postId, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const id = ownReaction?.[reactionId]?.[0]?.id;
    if (id) {
      const newOwnReaction = {...ownReaction};
      newOwnReaction[reactionId] = [];
      const newReactionCounts = {...reactionCounts};
      newReactionCounts[reactionId] = Math.max(
        0,
        (newReactionCounts[reactionId] || 0) - 1,
      );
      yield onUpdateReactionOfPostById(
        postId,
        newOwnReaction,
        newReactionCounts,
      );
      yield call(postDataHelper.deleteReaction, id);
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(postId, ownReaction, reactionCounts); //rollback
    console.log(`\x1b[31m🐣️ deleteReactToPost : ${e}\x1b[0m`);
  }
}

// import {takeLatest} from 'redux-saga/effects';
// import {makeGetStreamRequest} from '~/services/httpApiRequest';
//
// import {ActionTypes} from '~/utils';
//
// export default function* homeSaga() {
//   yield takeLatest(ActionTypes.GetStreamSample, getStreamSample);
// }
//
// function* getStreamSample({payload}: any) {
//   const {streamClient} = payload;
//   try {
//     const streamResponse = yield makeGetStreamRequest(
//       streamClient,
//       'user',
//       'userIdtest',
//       'get',
//       {limit: 5, offset: 5},
//     );
//     console.log('streamResponse:', streamResponse);
//   } catch (e) {
//     console.log('getStreamSample error:', e);
//   }
// }

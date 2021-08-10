import {put, call, takeLatest, select} from 'redux-saga/effects';
import {isArray} from 'lodash';

import {
  IParamSearchMentionAudiences,
  IPostActivity,
  IPostCreatePost,
} from '~/interfaces/IPost';
import postTypes from '~/screens/Post/redux/types';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {withNavigation} from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

const navigation = withNavigation(rootNavigationRef);

export default function* postSaga() {
  yield takeLatest(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
  yield takeLatest(
    postTypes.GET_SEARCH_MENTION_AUDIENCES,
    getSearchMentionAudiences,
  );
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
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

import {put, call, takeLatest} from 'redux-saga/effects';
import {IPostCreatePost} from '~/interfaces/IPost';
import postTypes from '~/screens/Post/redux/types';
import postActions from '~/screens/Post/redux/actions';
import postDataMocks from '~/screens/Post/helper/PostDataMocks';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';

export default function* postSaga() {
  yield takeLatest(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
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
    // const response = yield call(postDataHelper.postCreateNewPost, payload);
    console.log(
      '\x1b[36m',
      'namanh --- postCreateNewPost | postCreateNewPost : ',
      JSON.stringify(postDataMocks.postCreateNewPost, undefined, 2),
      '\x1b[0m',
    );
    yield put(postActions.setLoadingCreatePost(false));
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

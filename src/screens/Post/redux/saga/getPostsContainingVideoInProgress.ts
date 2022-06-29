import {call, put} from 'redux-saga/effects';

import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';

function* getPostsContainingVideoInProgress(): any {
  try {
    const response = yield call(postDataHelper.getDraftPosts, {
      isProcessing: true,
    });

    if (response?.data?.length > 0) {
      yield put(postActions.setAllPostContainingVideoInProgress(response));
    }
  } catch (e: any) {
    console.log(
      `\x1b[31m🐣️ saga getPostsContainingVideoInProgress error: `,
      e,
      `\x1b[0m`,
    );
  }
}

export default getPostsContainingVideoInProgress;

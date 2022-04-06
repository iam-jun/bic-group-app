import {IPayloadPutEditPost} from '~/interfaces/IPost';
import {call, put} from 'redux-saga/effects';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import i18n from 'i18next';
import modalActions from '~/store/modal/actions';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';

const navigation = withNavigation(rootNavigationRef);

export default function* putEditPost({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditPost;
}): any {
  const {id, data, replaceWithDetail = true, onRetry} = payload;
  if (!id || !data) {
    console.log(`\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m`);
    return;
  }
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(postDataHelper.putEditPost, {postId: id, data});
    yield put(postActions.setLoadingCreatePost(false));
    if (response?.data) {
      const post = response?.data;
      yield put(postActions.addToAllPosts({data: post}));
      yield put(
        modalActions.showHideToastMessage({
          content: 'post:text_edit_post_success',
          props: {textProps: {useI18n: true}, type: 'success'},
        }),
      );
      if (replaceWithDetail) {
        navigation.replace(homeStack.postDetail, {post_id: post?.id});
      } else {
        navigation.goBack();
      }
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    yield put(
      modalActions.showHideToastMessage({
        content: i18n.t('post:text_edit_post_failed'),
        toastType: 'normal',
        props: {
          textProps: {useI18n: true},
          type: 'error',
          rightText: i18n.t('common:text_retry'),
          onPressRight: onRetry,
        },
      }),
    );
  }
}

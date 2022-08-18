import { call, put } from 'redux-saga/effects';
import i18n from 'i18next';
import { IPayloadPutEditPost } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import streamApi from '~/api/StreamApi';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

export default function* putEditPost({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditPost;
}): any {
  const {
    id,
    data,
    replaceWithDetail = true,
    onRetry,
    msgSuccess,
    msgError,
    disableNavigate,
  } = payload;
  if (!id || !data) {
    console.error('\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m');
    return;
  }
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(
      streamApi.putEditPost, { postId: id, data },
    );
    yield put(postActions.setLoadingCreatePost(false));
    if (response?.data) {
      const post = response?.data;
      yield put(postActions.addToAllPosts({ data: post }));
      yield put(modalActions.showHideToastMessage({
        content: msgSuccess || 'post:text_edit_post_success',
        props: { textProps: { useI18n: true }, type: 'success' },
      }));
      if (!disableNavigate) {
        yield call(
          navigate, replaceWithDetail, post?.id,
        );
      }
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    yield put(modalActions.showHideToastMessage({
      content: msgError || 'post:text_edit_post_failed',
      toastType: 'normal',
      props: {
        textProps: { useI18n: true },
        type: 'error',
        rightText: i18n.t('common:text_retry'),
        onPressRight: onRetry,
      },
    }));
  }
}

export function navigate(
  replaceWithDetail: boolean, postId?: string,
) {
  if (replaceWithDetail) {
    navigation.replace(
      homeStack.postDetail, { post_id: postId },
    );
  } else {
    navigation.goBack();
  }
}

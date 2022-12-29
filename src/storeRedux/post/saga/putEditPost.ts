import { call, put } from 'redux-saga/effects';
import i18n from 'i18next';
import { IPayloadAddToAllPost, IPayloadPutEditPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postActions from '~/storeRedux/post/actions';
import streamApi from '~/api/StreamApi';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showToastSuccess from '~/store/helper/showToastSuccess';
import useModalStore from '~/store/modal';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

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
      usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      showToastSuccess(response, msgSuccess || 'post:text_edit_post_success');
      if (!disableNavigate) {
        yield call(
          navigate, replaceWithDetail, post?.id,
        );
      }
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    const toast: IToastMessage = {
      content: e?.meta?.message || msgError || 'post:text_edit_post_failed',
      type: ToastType.ERROR,
      buttonText: i18n.t('common:text_retry'),
      onButtonPress: onRetry,
    };
    useModalStore.getState().actions.showToast(toast);
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

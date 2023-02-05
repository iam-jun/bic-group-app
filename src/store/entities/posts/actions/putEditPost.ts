import i18n from 'i18next';
import { IParamPutEditPost, IPayloadAddToAllPost, IPayloadPutEditPost } from '~/interfaces/IPost';
import { IPostsState } from '../index';
import streamApi from '~/api/StreamApi';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToast from '~/store/helper/showToast';

const navigation = withNavigation(rootNavigationRef);

const putEditPost = (_set, get) => async (payload: IPayloadPutEditPost) => {
  const {
    id, data, replaceWithDetail = true, onRetry, msgSuccess, msgError, disableNavigate,
  } = payload || {};

  if (!id || !data) {
    console.error('\x1b[31m🐣️ putEditPost: Id or data not found\x1b[0m');
    return;
  }

  try {
    const { actions }: IPostsState = get() || {};

    useCreatePostStore.getState().actions.setLoadingCreatePost(true);

    const params: IParamPutEditPost = {
      postId: id,
      data,
    };
    const response = await streamApi.putEditPost(params);

    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    if (response?.data) {
      const post = response?.data;
      actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      showToastSuccess(response, msgSuccess || 'post:text_edit_post_success');
      if (!disableNavigate) {
        navigate(replaceWithDetail, post?.id);
      }
    }
  } catch (error) {
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);
    const toast: IToastMessage = {
      content: error?.meta?.message || msgError || 'post:text_edit_post_failed',
      type: ToastType.ERROR,
      buttonText: i18n.t('common:text_retry'),
      onButtonPress: onRetry,
    };
    showToast(toast);
  }
};

export function navigate(replaceWithDetail: boolean, postId?: string) {
  if (replaceWithDetail) {
    navigation.replace(homeStack.postDetail, { post_id: postId });
  } else {
    navigation.goBack();
  }
}

export default putEditPost;

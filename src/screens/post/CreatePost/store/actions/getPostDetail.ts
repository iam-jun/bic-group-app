import streamApi from '~/api/StreamApi';
import { IParamGetPostDetail } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { ICreatePostState } from '..';

const navigation = withNavigation?.(rootNavigationRef);

export const getPostDetail = (set, _get) => async (postId: string) => {
  try {
    const params: IParamGetPostDetail = {
      postId,
    };
    const resp = await streamApi.getPostDetail(params);
    if (resp?.data) {
      usePostsStore.getState().actions.addToPosts({ data: resp.data });
      set((state: ICreatePostState) => {
        state.isLoadPostDetailDone = true;
      }, 'getPostDetail success');
    }
  } catch (e) {
    console.error('\x1b[35m🐣️ getPostDetail error: ', e, '\x1b[0m');
    showToastError(e);
    navigation.goBack();
  }
};

export default getPostDetail;

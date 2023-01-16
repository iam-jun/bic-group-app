import { IPayloadAddToAllPost, IPayloadDeletePost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import streamApi from '../../../api/StreamApi';
import { timeOut } from '~/utils/common';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';

export default function* deletePost({
  payload,
}: {
  type: string;
  payload: IPayloadDeletePost;
}): any {
  const { id, callbackError } = payload || {};
  if (!id) {
    console.warn('\x1b[31m🐣️ saga deletePost: id not found\x1b[0m');
    return;
  }
  try {
    const response = yield streamApi.deletePost(id);
    if (response?.data) {
      const post = usePostsStore.getState()?.posts?.[id] || {};
      const deletedPost = {
        ...post,
        deleted: true,
      };
      usePostsStore.getState().actions.addToPosts({ data: deletedPost } as IPayloadAddToAllPost);

      yield timeOut(500);

      showToast({ content: 'post:delete_post_complete' });
    }
  } catch (e: any) {
    if (e?.meta?.errors?.groupsDenied) {
      callbackError?.(e.meta.errors.groupsDenied);
    } else showToastError(e);
  }
}

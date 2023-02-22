import { IPayloadAddToAllPost, IPayloadDeletePost } from '~/interfaces/IPost';
import { IPostsState } from '../index';
import showToastError from '~/store/helper/showToastError';
import streamApi from '~/api/StreamApi';
import { timeOut } from '~/utils/common';
import showToastSuccess from '~/store/helper/showToastSuccess';

const deletePost = (_set, get) => async (payload: IPayloadDeletePost) => {
  const { id, callbackError } = payload || {};

  if (!id) {
    console.warn('\x1b[31m🐣️ deletePost: Id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deletePost(id);
    if (response?.data) {
      const { posts, actions }: IPostsState = get();
      const deletedPost = {
        ...posts[id],
        deleted: true,
      };
      actions.addToPosts({ data: deletedPost } as IPayloadAddToAllPost);
      await timeOut(500);
      showToastSuccess(response);
    }
  } catch (error) {
    if (error?.meta?.errors?.groupsDenied && !!callbackError) {
      callbackError(error.meta.errors.groupsDenied);
    } else showToastError(error);
  }
};

export default deletePost;

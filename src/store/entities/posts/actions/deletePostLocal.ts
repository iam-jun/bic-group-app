import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import { IPostsState } from '../index';
import showToastError from '~/store/helper/showToastError';

const deletePostLocal = (_set, get) => (id: string) => {
  if (!id) {
    console.warn('\x1b[31m🐣️ deletePostLocal: Id not found\x1b[0m');
    return;
  }

  try {
    const { posts, actions }: IPostsState = get();
    const deletedPost = {
      ...posts[id],
      deleted: true,
    };
    actions.addToPosts({ data: deletedPost } as IPayloadAddToAllPost);
  } catch (error) {
    showToastError(error);
  }
};

export default deletePostLocal;

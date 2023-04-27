import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';
import { IPostsInProgressState } from '..';

const getPostsInProgress = (set, get) => async () => {
  try {
    const response = await streamApi.getDraftContents({
      isProcessing: true,
      type: PostType.POST,
    });
    const data:IPostsInProgressState = get();
    const { total = 0, data: posts = [] } = data;
    if (response?.data?.length > 0) {
      if (posts?.length > 0) {
        let count = 0;
        posts.forEach((item1: any) => {
          const index = response.data.findIndex((item2: any) => item2?.id === item1?.id);
          if (index !== -1) count += 1;
        });
        if (
          count === response.data.length
          && posts.length >= count
        ) {
          if (total === 0) {
            data.reset();
          } else {
            set((state: IPostsInProgressState) => {
              state.total = response.total;
              state.data = response.data;
            }, 'setPostInProgress1');
          }
        } else {
          set((state: IPostsInProgressState) => {
            state.total = response.total;
            state.data = response.data;
          }, 'setPostInProgress2');
        }
      } else {
        set((state: IPostsInProgressState) => {
          state.total = response.total;
          state.data = response.data;
        }, 'setPostInProgress3');
      }
    } else if (posts.length > 0) {
      data.reset();
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ getPostsInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
};

export default getPostsInProgress;

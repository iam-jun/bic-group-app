import streamApi from '~/api/StreamApi';
import { IPost, PostType } from '~/interfaces/IPost';
import { IPostsInProgressState } from '..';

const getPostsInProgress = (set, get) => async () => {
  try {
    const response = await streamApi.getDraftContents({
      isProcessing: true,
      type: PostType.POST,
    });

    const {
      total = 0, data: posts = [], reset, actions,
    }: IPostsInProgressState = get();

    if (response?.data?.list?.length > 0) {
      shouldSetData({
        posts,
        total,
        response,
        reset,
        set,
        actions,
      });
    } else if (posts.length > 0) {
      reset();
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ getPostsInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
};

// known issue: be dont return total, so the number of post is max 10 and hasNextPage is 10+
const shouldSetData = (params: {
  posts: any[];
  total: number;
  response: {
    data: {
      list: IPost[];
      meta: {
        hasNextPage: boolean;
      };
    };
  };
  reset: () => void;
  set: (a: (state: IPostsInProgressState) => void, b: string) => void;
  actions: IPostsInProgressState['actions'];
}) => {
  const {
    posts, total, response, set, actions,
  } = params;
  if (posts?.length > 0) {
    let count = 0;
    posts.forEach((item1: any) => {
      const index = response.data.list.findIndex((item2: any) => item2?.id === item1?.id);
      if (index !== -1) count += 1;
    });
    if (count === response.data.list.length && posts.length >= count) {
      if (total === 0) {
        // reset();
        actions.setTotal(0);
      } else {
        set((state: IPostsInProgressState) => {
          state.total = response.data.list.length;
          state.data = response.data.list;
          state.hasNextPage = response.data.meta.hasNextPage;
        }, 'setPostInProgress1');
      }
    } else {
      set((state: IPostsInProgressState) => {
        state.total = response.data.list.length;
        state.data = response.data.list;
        state.hasNextPage = response.data.meta.hasNextPage;
      }, 'setPostInProgress2');
    }
  } else {
    set((state: IPostsInProgressState) => {
      state.total = response.data.list.length;
      state.data = response.data.list;
      state.hasNextPage = response.data.meta.hasNextPage;
    }, 'setPostInProgress3');
  }
};

export default getPostsInProgress;

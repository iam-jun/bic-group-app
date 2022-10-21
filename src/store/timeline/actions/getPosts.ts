import groupApi from '~/api/GroupApi';
import { IPostActivity } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IBaseListState } from '~/store/interfaces/IBaseState';
import { ITimelineState } from '..';

const getPosts = (set, get) => async (id: string, isRefresh?: boolean) => {
  const { items } = get();
  const currentPosts = items[id] || {};
  if (currentPosts.loading) return;

  // for the 1st time items[id] can be undefined so we must assign object
  if (!items[id]) {
    set((state: ITimelineState) => { state.items[id] = {} as IBaseListState<IPostActivity>; });
  }

  set((state: ITimelineState) => {
    state.items[id].loading = true;
    state.items[id].refreshing = isRefresh;
  }, `getPosts groupId: ${id}, isRefresh: ${isRefresh} `);

  try {
    const offset = isRefresh ? 0 : currentPosts.ids?.length;
    const params = {
      groupId: id,
      offset,
      limit: 10,
    };
    const response = await groupApi.getGroupPosts(params);
    const result = response.data?.list || [];
    usePostsStore.getState().actions.addToPosts({ data: result, handleComment: true });

    const newIds = result.map((item) => item.id);
    const currentIds = currentPosts.ids || [];
    const ids = isRefresh ? [] : currentIds;
    set((state: ITimelineState) => {
      state.items[id].loading = false;
      state.items[id].refreshing = false;
      state.items[id].ids = ids.concat(newIds);
      state.items[id].hasNextPage = response.data?.meta?.hasNextPage;
    }, 'getPostsSuccess');
  } catch (error) {
    set((state: ITimelineState) => {
      state.items[id].loading = false;
      state.items[id].refreshing = false;
      state.items[id].error = error;
    }, 'getPostsError');
  }
};

export default getPosts;

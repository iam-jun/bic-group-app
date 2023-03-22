import groupApi from '~/api/GroupApi';
import { IPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IBaseListState } from '~/store/interfaces/IBaseState';
import { ITimelineState } from '..';
import {
  getParamsContentFeed,
  isFilterWithThisAttributeFeed,
} from '~/screens/Home/store/helper';
import { timeOut } from '~/utils/common';
import { AttributeFeed } from '~/interfaces/IFeed';

const getPosts = (set, get) => async (id: string, isRefresh = false) => {
  const { timelines }: ITimelineState = get();
  const { contentFilter, attributeFilter, data } = timelines[id] || {};
  const currentPosts: IBaseListState<IPost> = data[contentFilter][attributeFilter];
  if (currentPosts.loading) return;

  set((state: ITimelineState) => {
    state.timelines[id].data[contentFilter][attributeFilter] = {
      ...state.timelines[id].data[contentFilter][attributeFilter],
      loading: true,
      refreshing: isRefresh,
    };
  }, `getPosts community/group Id: ${id}, isRefresh: ${isRefresh} `);

  try {
    const offset = isRefresh ? 0 : currentPosts.ids?.length;
    const params = {
      groupId: id,
      offset,
      limit: 10,
      isImportant: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.IMPORTANT),
      isSaved: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.SAVED),
      isMine: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.MINE),
      type: getParamsContentFeed(contentFilter),
    };
    const response = await groupApi.getGroupPosts(params);
    await timeOut(200);
    const result = response.data?.list || [];
    usePostsStore.getState().actions.addToPosts({ data: result, handleComment: true });

    const newIds = result.map((item) => item.id);
    const currentIds = currentPosts.ids || [];
    const ids = isRefresh ? [] : currentIds;
    set((state: ITimelineState) => {
      state.timelines[id].data[contentFilter][attributeFilter] = {
        ...state.timelines[id].data[contentFilter][attributeFilter],
        loading: false,
        refreshing: false,
        ids: ids.concat(newIds),
        hasNextPage: response.data?.meta?.hasNextPage,
      };
    }, `getPostsSuccess community/group Id: ${id}`);
  } catch (error) {
    set((state: ITimelineState) => {
      state.timelines[id].data[contentFilter][attributeFilter] = {
        ...state.timelines[id].data[contentFilter][attributeFilter],
        loading: false,
        refreshing: false,
        hasNextPage: false,
        error,
      };
    }, `getPostsError community/group Id: ${id}`);
  }
};

export default getPosts;

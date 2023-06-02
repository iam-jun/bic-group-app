import usePostsStore from '~/store/entities/posts';
import { IDataFilterTimelines, ITimelineState } from '..';
import {
  getParamsContentFeed,
  isFilterWithThisAttributeFeed,
} from '~/screens/Home/store/helper';
import { timeOut } from '~/utils/common';
import { AttributeFeed } from '~/interfaces/IFeed';
import { IParamGetGroupPosts } from '~/interfaces/IGroup';
import streamApi from '~/api/StreamApi';

const getPosts = (set, get) => async (id: string, isRefresh = false) => {
  const { timelines }: ITimelineState = get();
  const { contentFilter, attributeFilter, data } = timelines[id] || {};
  const currentPosts: IDataFilterTimelines = data[contentFilter][attributeFilter];

  if (currentPosts.loading) return;

  set((state: ITimelineState) => {
    state.timelines[id].data[contentFilter][attributeFilter] = {
      ...state.timelines[id].data[contentFilter][attributeFilter],
      loading: true,
      refreshing: isRefresh,
    };
  }, `getPosts community/group Id: ${id}, isRefresh: ${isRefresh} `);

  try {
    const endCursor = isRefresh ? null : currentPosts.endCursor;
    const params: IParamGetGroupPosts = {
      groupId: id,
      after: endCursor,
      limit: 10,
      isImportant: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.IMPORTANT),
      isSaved: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.SAVED),
      // isMine: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.MINE),
      type: getParamsContentFeed(contentFilter),
    };
    const response = await streamApi.getGroupPosts(params);
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
        endCursor: response.data?.meta?.endCursor,
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
        endCursor: null,
      };
    }, `getPostsError community/group Id: ${id}`);
  }
};

export default getPosts;

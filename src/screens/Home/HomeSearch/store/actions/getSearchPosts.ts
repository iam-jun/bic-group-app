import streamApi from '~/api/StreamApi';
import { IParamGetSearchPost, IPayloadGetSearchPosts } from '~/interfaces/IHome';
import { IPayloadAddToAllPost, IPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { IFeedSearchState } from '..';

const getSearchPosts = (set, get) => async (payload: IPayloadGetSearchPosts) => {
  try {
    let data: IPost[] = [];
    const {
      searchText, actors, startDate, endDate, groupId, type,
    } = payload || {};
    const { newsfeedSearch, actions }: IFeedSearchState = get();
    const { searchResults, hasNextPage, loadingResult } = newsfeedSearch || {};
    const params: IParamGetSearchPost = { contentSearch: searchText };

    if (!hasNextPage || loadingResult || !searchText?.trim?.()) {
      return;
    }

    data = searchResults;

    // save keyword to recent search
    if (data.length === 0) {
      actions.saveRecentSearchKeywords(searchText);
    }

    params.offset = data.length;

    if (actors) {
      params.actors = actors;
    }
    if (startDate) {
      params.startTime = startDate;
    }
    if (endDate) {
      params.endTime = endDate;
    }
    if (groupId) {
      params.groupId = groupId;
    }
    if (type) {
      params.type = type;
    }

    set((state: IFeedSearchState) => {
      state.newsfeedSearch.loadingResult = true;
    }, 'getSearchPosts');

    const response = await streamApi.getSearchPost(params);
    data = data.concat(response?.list);
    usePostsStore.getState().actions.addToPosts({ data } as IPayloadAddToAllPost);

    set((state: IFeedSearchState) => {
      state.newsfeedSearch.loadingResult = false;
      state.newsfeedSearch.searchResults = data;
      state.newsfeedSearch.hasNextPage = data.length < response.meta?.total;
    }, 'getSearchPosts success');
  } catch (e) {
    set((state: IFeedSearchState) => {
      state.newsfeedSearch.loadingResult = false;
    }, 'getSearchPosts failed');
    showToastError(e);
  }
};

export default getSearchPosts;

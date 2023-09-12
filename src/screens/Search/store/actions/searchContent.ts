import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ISearchState } from '..';
import {
  ParamsSearchContent,
  PayloadSearchContent,
} from '~/interfaces/ISearch';
import appConfig from '~/configs/appConfig';

const searchContent = (set, get) => async (payload: PayloadSearchContent) => {
  const {
    searchScreenKey,
    searchText,
    contentType,
    group,
    isSelectAllInnerGroups,
    tags,
    topics,
    createdBy,
    datePosted,
  } = payload || {};

  try {
    const { search, actions }: ISearchState = get();
    const {
      searchResults = [],
      hasNextPage,
      loadingResult,
      endCursor,
    } = search[searchScreenKey] || {};
    const params: ParamsSearchContent = {};

    if (!hasNextPage || loadingResult) {
      return;
    }

    // save keyword to recent search
    if (searchText?.trim().length > 0) {
      actions.saveRecentSearchKeywords(searchText);
    }

    params.limit = appConfig.recordsPerPage;
    params.after = endCursor;
    params.isIncludedInnerGroups = !!isSelectAllInnerGroups;

    if (searchText) {
      params.keyword = searchText;
    }
    if (contentType) {
      params.contentTypes = contentType;
    }
    if (group) {
      params.groupId = group.id;
    }
    if (tags) {
      params.tags = tags.map((tag) => tag.ids).flat();
    }
    if (topics) {
      params.topics = topics.map((topic) => topic.id);
    }
    if (createdBy) {
      params.actors = createdBy.map((user) => user.id);
    }
    if (datePosted) {
      params.startTime = datePosted.startDate;
      params.endTime = datePosted.endDate;
    }

    set((state: ISearchState) => {
      state.search[searchScreenKey].loadingResult = true;
    }, 'searchContent');

    const response = await streamApi.searchContent(params);

    actions.addToContent(response?.list);

    set((state: ISearchState) => {
      state.search[searchScreenKey].loadingResult = false;
      state.search[searchScreenKey].endCursor = response?.meta?.endCursor;
      state.search[searchScreenKey].hasNextPage = response?.meta?.hasNextPage;
      state.search[searchScreenKey].totalResults = response?.meta?.total || 0;
      state.search[searchScreenKey].searchResults = [
        ...searchResults,
        ...(response?.list || []).map((post) => post.id),
      ];
    }, 'searchContent success');
  } catch (e) {
    set((state: ISearchState) => {
      state.search[searchScreenKey].loadingResult = false;
      state.search[searchScreenKey].endCursor = null;
      state.search[searchScreenKey].hasNextPage = false;
    }, 'searchContent failed');
    showToastError(e);
  }
};

export default searchContent;

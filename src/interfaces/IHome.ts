import {StreamClient} from 'getstream';

export interface IPayloadGetHomePost {
  streamClient: StreamClient;
  userId: string;
  isRefresh?: boolean;
}

export interface IPayloadSetNewsfeedSearch {
  isShow?: boolean;
  isSuggestion?: boolean;
  searchText?: string;
  loadingSuggestion?: boolean;
  loadingResult?: boolean;
  suggestionResults?: any[];
  searchResults?: any[];
  searchInputRef?: any;
  totalResult?: number;
}

export interface IPayloadSetNewsfeedSearchFilter {
  createdBy?: 'me' | undefined | any;
  date?: any;
}

export interface IPayloadSetNewsfeedSearchUsers {
  key?: string;
  limit?: number;
  offset?: number;
  data?: any[];
  loading?: boolean;
  canLoadMore?: boolean;
}

export interface IPayloadSetNewsfeedSearchRecentKeywords {
  loading?: boolean;
  data?: any[];
}

export interface IParamGetSearchPost {
  content: string;
  actors?: string;
  start_time?: string;
  end_time?: string;
  offset?: number;
  limit?: number;
}

export interface IParamGetRecentSearchKeywords {
  sort?: 'desc' | 'asc';
  limit?: number;
  target?: 'post' | 'user' | 'article' | 'all';
}

export interface IParamPostNewRecentSearchKeyword {
  keyword: string;
  target: 'post' | 'user' | 'article' | 'all';
}

export interface IPayloadGetSearchPosts {
  searchText: string;
  actors?: string;
  startDate?: string;
  endDate?: string;
  isLoadMore?: boolean;
}

export interface ISelectedFilterUser {
  id?: string;
  name?: string;
}

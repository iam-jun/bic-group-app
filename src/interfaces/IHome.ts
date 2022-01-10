export interface IPayloadGetHomePost {
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

export interface IParamGetFeed {
  offset?: number;
  limit?: number;
  recent_reactions_limit?: number;
  enrich?: boolean;
  own_reactions?: boolean;
  with_own_reactions?: boolean;
  with_own_children?: boolean;
  with_recent_reactions?: boolean;
  with_reaction_counts?: boolean;
  ranking?: 'important_first' | string;
}

export interface IParamGetSearchPost {
  content: string;
  actors?: string;
  start_time?: string;
  end_time?: string;
  offset?: number;
  limit?: number;
}

export type IRecentSearchTarget = 'post' | 'user' | 'article' | 'all';

export interface IParamGetRecentSearchKeywords {
  sort?: 'desc' | 'asc';
  limit?: number;
  target?: IRecentSearchTarget;
  showLoading?: boolean;
}

export interface IParamPostNewRecentSearchKeyword {
  keyword: string;
  target: IRecentSearchTarget;
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

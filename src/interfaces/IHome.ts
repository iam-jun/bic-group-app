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
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGTE?: number;
  idLTE?: number;
  idGT?: number;
  idLT?: number;
}

export interface IParamGetSearchPost {
  content: string;
  actors?: string;
  startTime?: string;
  endTime?: string;
  offset?: number;
  limit?: number;
  order?: IOrder;
  important?: boolean;
  idGTE?: number;
  idLTE?: number;
  idGT?: number;
  idLT?: number;
}

export type IRecentSearchTarget = 'post' | 'user' | 'article' | 'all';
export type IOrder = 'ASC' | 'DESC';

export interface IParamGetRecentSearchKeywords {
  limit?: number;
  target?: IRecentSearchTarget;
  showLoading?: boolean;
  order?: IOrder;
  offset?: number;
  idGTE?: number;
  idLTE?: number;
  idGT?: number;
  idLT?: number;
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

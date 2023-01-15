import { PostType } from './IPost';

export interface IPayloadSetNewsfeedSearch {
  isShow?: boolean;
  isSuggestion?: boolean;
  searchText?: string;
  loadingSuggestion?: boolean;
  loadingResult?: boolean;
  suggestionResults?: any[];
  searchResults?: any[];
  searchViewRef?: any;
  totalResult?: number;
  groupId?: string;
}

export interface IPayloadSetNewsfeedSearchUsers {
  key?: string;
  limit?: number;
  offset?: number;
  data?: any[];
  loading?: boolean;
  canLoadMore?: boolean;
  groupId?: string;
}

export interface IPayloadSetNewsfeedSearchRecentKeywords {
  loading?: boolean;
  data?: any[];
}

export interface IParamGetFeed {
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  isImportant?: boolean;
  isSaved?: boolean;
  type?: PostType | undefined;
}

export interface IParamGetSearchPost {
  contentSearch?: string;
  actors?: string;
  startTime?: string;
  endTime?: string;
  offset?: number;
  limit?: number;
  order?: IOrder;
  important?: boolean;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  groupId?: string;
  tagName?: string;
}

export type IRecentSearchTarget = 'post' | 'user' | 'article' | 'all';
export type IOrder = 'ASC' | 'DESC';

export interface IParamGetRecentSearchKeywords {
  limit?: number;
  target?: IRecentSearchTarget;
  showLoading?: boolean;
  order?: IOrder;
  offset?: number;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
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
  groupId?: string;
  tagName?: string;
}

export interface ISelectedFilterUser {
  id?: string;
  name?: string;
}

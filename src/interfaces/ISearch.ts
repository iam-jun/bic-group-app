import { IGroup } from './IGroup';
import { PostType } from './IPost';
import { ICategory } from '~/interfaces/IArticle';

export type IRecentSearchTarget = 'post' | 'user' | 'article' | 'all';
export type IOrder = 'ASC' | 'DESC';

export interface IRecentSearchKeywordItem {
  id: string;
  keyword: string;
}

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

export interface ISearchFilter {
  contentType?: PostType[];
  group?: IGroup;
  isSelectAllInnerGroups?: boolean;
  tags?: string[];
  topics?: ICategory[];
  createdBy?: ISearchUser[];
  datePosted?: {
    startDate?: string;
    endDate?: string;
  };
}

export interface ISearch {
  searchText: string;
  isSuggestion: boolean;
  loadingResult: boolean;
  hasNextPage: boolean;
  endCursor: string | null;
  searchResults: string[];
  totalResults: number;
  filter: ISearchFilter;
  tempFilter?: ISearchFilter;
}

export type UpdateSearchData = Partial<ISearch>;

export interface ISearchUser {
  id?: string;
  username?: string;
  fullname?: string;
  avatar?: string;
  isDeactivated?: boolean;
  isVerified?: boolean;
}

export type ParamsSearchTags = {
  keyword: string;
};

export type PayloadSearchContent = {
  searchScreenKey: string;
  searchText?: string;
} & ISearchFilter;

export type ParamsSearchContent = {
  keyword?: string;
  contentTypes?: PostType[];
  groupId?: string;
  isIncludedInnerGroups?: boolean;
  tagNames?: string[];
  topics?: string[];
  actors?: string[];
  startTime?: string;
  endTime?: string;
  limit?: number;
  after?: string | null;
};

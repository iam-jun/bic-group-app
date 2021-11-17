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
}

export interface IPayloadSetNewsfeedSearchFilter {
  createdBy?: 'me' | undefined | any;
  date?: any;
}

export interface IParamGetSearchPost {
  content: string;
  actors?: string;
  start_time?: string;
  end_time?: string;
}

export interface IPayloadGetSearchPosts {
  searchText: string;
  actors?: string;
  startDate?: string;
  endDate?: string;
}

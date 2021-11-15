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

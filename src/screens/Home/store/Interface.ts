import IBaseState from '~/store/interfaces/IBaseState';

export enum ATTRIBUTE_FEED {
  ALL = 'ALL',
  IMPORTANT = 'IMPORTANT',
}

export enum CONTENT_FEED {
  ALL = 'ALL',
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  SERIES = 'SERIES',
}

export interface IHomeFeed {
  isLoading: boolean;
  refreshing: boolean;
  data: string[];
  canLoadMore: boolean;
}

export type IFeed = {
  [T in CONTENT_FEED]: { [S in ATTRIBUTE_FEED]: IHomeFeed };
};
interface IHomeState extends IBaseState {
  contentFilter: CONTENT_FEED;
  attributeFilter: ATTRIBUTE_FEED;
  feed: IFeed;
  actions?: {
    setContentFilter?: (contentFilter: CONTENT_FEED) => void;
    setAttributeFilter?: (attributeFilter: ATTRIBUTE_FEED) => void;
    setDataFeed?: (
      data: IHomeFeed,
      contentFilter?: CONTENT_FEED,
      attributeFilter?: ATTRIBUTE_FEED
    ) => void;

    getDataFeed?: (isRefresh?: boolean) => void;
    refreshHome?: () => void;
  };
}

export default IHomeState;

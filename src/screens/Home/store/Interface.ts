import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IHomeFeed {
  isLoading: boolean;
  refreshing: boolean;
  data: string[];
  canLoadMore: boolean;
}

export type IFeed = {
  [T in ContentFeed]: { [S in AttributeFeed]: IHomeFeed };
};
interface IHomeState extends IBaseState {
  contentFilter: ContentFeed;
  attributeFilter: AttributeFeed;
  feed: IFeed;
  actions?: {
    setContentFilter?: (contentFilter: ContentFeed) => void;
    setAttributeFilter?: (attributeFilter: AttributeFeed) => void;
    setDataFeed?: (
      data: IHomeFeed,
      contentFilter?: ContentFeed,
      attributeFilter?: AttributeFeed
    ) => void;

    getDataFeed?: (isRefresh?: boolean) => void;
    refreshHome?: () => void;
  };
}

export default IHomeState;

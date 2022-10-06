import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IYourCommunitiesState extends IBaseState, IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
  actions?: {
    getYourCommunities?: (isRefreshing?: boolean) => void;
  };
}

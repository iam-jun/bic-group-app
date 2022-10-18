import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDiscoverCommunitiesState extends IBaseState, IFetchingState {
  ids: string[];
  actions?: {
    getDiscoverCommunities?: (isRefreshing?: boolean) => void;
  };
}

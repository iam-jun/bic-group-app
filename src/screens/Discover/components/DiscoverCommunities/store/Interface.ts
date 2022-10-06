import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDiscoverCommunitiesState extends IBaseState, IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
  actions?: {
    getDiscoverCommunities?: (isRefreshing?: boolean) => void;
    setDiscoverCommunities?: (communityId: string, data: any) => void;
  };
}

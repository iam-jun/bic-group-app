import { IParamGetCommunities } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDiscoverCommunitiesSearchState extends IBaseState, IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
  actions?: {
    getDiscoverCommunitiesSearch?: (params: IParamGetCommunities) => void;
    setDiscoverCommunitiesSearchItem?: (communityId: string, data: any) => void;
  };
}

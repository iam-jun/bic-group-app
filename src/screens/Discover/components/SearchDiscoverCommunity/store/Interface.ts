import { IParamGetCommunities } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDiscoverCommunitiesSearchState extends IBaseState, IFetchingState {
  ids: string[];
  actions?: {
    getDiscoverCommunitiesSearch?: (params: IParamGetCommunities) => void;
  };
}

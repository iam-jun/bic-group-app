import { IParamGetCommunities } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface ISearchJoinedCommunitiesState extends IBaseState, IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
  actions?: {
    searchJoinedCommunities?: (params: IParamGetCommunities) => void;
  };
}

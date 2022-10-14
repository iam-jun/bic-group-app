import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IYourGroupsState extends IBaseState, IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
  actions?: {
    getYourGroups?: (isRefreshing?: boolean) => void;
  };
}

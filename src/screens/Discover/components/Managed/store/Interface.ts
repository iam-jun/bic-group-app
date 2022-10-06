import IFetchingState from '~/store/interfaces/IFetchingState';

interface IOwnerState extends IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
}

interface IManageState extends IFetchingState {
  ids: string[];
  items: {
    [id: string]: any;
  };
}

export interface IManagedState {
  refreshing: boolean;
  owner: IOwnerState;
  manage: IManageState;
  actions?: {
    getManaged?: (isRefreshing?: boolean) => void;
    getOwnerCommunity?: () => void;
    getManagedCommunityAndGroup?: (isRefreshing?: boolean) => void;
  };
}

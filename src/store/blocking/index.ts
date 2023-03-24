import { IBlockingUser } from '~/interfaces/IBlocking';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { createStore, resetStore } from '~/store/utils';
import getListBlockingUsers from './actions/getListBlockingUsers';
import unblockUser from './actions/unblockUser';

// This sprint 36: not have paging, only get list only 1 time
// Pre-declare pagination variables for later reuse
export interface IBlockingState extends IBaseState, IFetchingState {
  list: IBlockingUser[];
  actions: {
    getListBlockingUsers: (isRefreshing?: boolean) => void;
    unblockUser: (userId: string) => Promise<void>;
  };
}

const initialState: InitStateType<IBlockingState> = {
  list: [],
  loading: false,
  hasNextPage: true,
  refreshing: false,
};

const blockingState = (set, get): IBlockingState => ({
  ...initialState,
  actions: {
    getListBlockingUsers: getListBlockingUsers(set, get),
    unblockUser: unblockUser(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useBlockingStore = createStore<IBlockingState>(blockingState);

export default useBlockingStore;

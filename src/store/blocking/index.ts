import { IBlockingUser } from '~/interfaces/IBlocking';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { createStore, resetStore } from '~/store/utils';
import blockUser from './actions/blockUser';
import getListBlockingUsers from './actions/getListBlockingUsers';
import getListRelationship from './actions/getListRelationship';
import unblockUser from './actions/unblockUser';

export interface IBlockingState extends IBaseState, IFetchingState {
  list: IBlockingUser[];
  listRelationship: string[];
  actions: {
    getListBlockingUsers: (isRefreshing?: boolean) => void;
    getListRelationship: (isRefreshing?: boolean) => Promise<void>;
    unblockUser: (userId: string) => Promise<void>;
    blockUser: (blockedUserId: string, callback?: () => void) => Promise<void>;
  };
}

const initialState: InitStateType<IBlockingState> = {
  list: [],
  loading: false,
  hasNextPage: true,
  refreshing: false,
  listRelationship: [],
};

const blockingState = (set, get): IBlockingState => ({
  ...initialState,
  actions: {
    getListBlockingUsers: getListBlockingUsers(set, get),
    getListRelationship: getListRelationship(set, get),
    unblockUser: unblockUser(set, get),
    blockUser: blockUser(),
  },
  reset: () => resetStore(initialState, set),
});

const useBlockingStore = createStore<IBlockingState>(blockingState);

export default useBlockingStore;

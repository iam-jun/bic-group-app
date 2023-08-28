import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import IFetchingState from '~/store/interfaces/IFetchingState';
import getGroupOfInvitationGroupSet from './actions/getGroupOfInvitationGroupSet';
import { IGroup } from '~/interfaces/IGroup';

export interface IGroupSetInvitationsStore extends IBaseState, IFetchingState {
  data: IGroup[],
  loading: boolean;
  totalGroups: number;
  isRefresing: boolean;

  actions: {
    getGroups: (invitationId: string, isRefresh?: boolean) =>void;
  }
}

const initialState: InitStateType<IGroupSetInvitationsStore> = {
  data: [],
  loading: false,
  totalGroups: 0,
  isRefresing: false,
};

const groupSetInvitationsStore = (set, get) => ({
  ...initialState,
  actions: {
    getGroups: getGroupOfInvitationGroupSet(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useGroupSetInvitationsStore = createStore<IGroupSetInvitationsStore>(groupSetInvitationsStore);

export default useGroupSetInvitationsStore;

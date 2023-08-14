import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import acceptInvitation from './actions/acceptInvitation';
import declineInvitation from './actions/declineInvitation';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { IInvitation } from '~/interfaces/IInvitation';
import getInvitations from './actions/getInvitations';

export interface IGroupedInvitations {
  id: number;
  title: string;
  data: string[];
}

export interface IMyInvitationsStore extends IBaseState, IFetchingState {
  groupedInvitations: IGroupedInvitations[];
  invitationData: {[id: string]: IInvitation};
  currentInvitationIds: number;

  requestingsAccept: { [id: string]: boolean };
  requestingsDecline: { [id: string]: boolean };
  accepted: { [id: string]: boolean };
  declined: { [id: string]: boolean };

  actions: {
    acceptInvitation: (invitationId: string) =>void;
    declineInvitation: (invitationId: string) => void;
    getInvitations: (isRefresh?: boolean) => void;
  }
}

const initialState = {
  requestingsAccept: {},
  requestingsDecline: {},
  accepted: {},
  declined: {},
  groupedInvitations: [],
  invitationData: {},
  hasNextPage: true,
  currentInvitationIds: 0,
};

const myInvitationsStore = (set, get) => ({
  ...initialState,
  actions: {
    acceptInvitation: acceptInvitation(set, get),
    declineInvitation: declineInvitation(set, get),
    getInvitations: getInvitations(set, get),
  },
});

const useMyInvitationsStore = createStore<IMyInvitationsStore>(myInvitationsStore);

export default useMyInvitationsStore;

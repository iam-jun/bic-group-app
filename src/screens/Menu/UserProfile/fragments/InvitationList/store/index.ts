import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import acceptInvitation from './actions/acceptInvitation';
import declineInvitation from './actions/declineInvitation';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { IInvitation } from '~/interfaces/IInvitation';
import getInvitations from './actions/getInvitations';

export interface IMyInvitationsStore extends IBaseState, IFetchingState {
  invitationIds: string[];
  invitationData: {[id: string]: IInvitation};

  requestingsAccept: { [id: string]: boolean };
  requestingsDecline: { [id: string]: boolean };
  accepted: { [id: string]: boolean };
  declined: { [id: string]: boolean };

  actions: {
    acceptInvitation: (notiInfo: any) =>void;
    declineInvitation: (notiInfo: any) => void;
    getInvitations: (isRefresh?: boolean) => void;
  }
}

const initialState = {
  requestingsAccept: {},
  requestingsDecline: {},
  accepted: {},
  declined: {},
  invitationIds: [],
  invitationData: {},
  hasNextPage: true,
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

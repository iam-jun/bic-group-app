import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import acceptInvitation from './actions/acceptInvitation';
import declineInvitation from './actions/declineInvitation';

export interface IMyInvitationsStore extends IBaseState {
    invitationIds: string[];

  requestingsAccept: { [id: string]: boolean };
  requestingsDecline: { [id: string]: boolean };
  accepted: { [id: string]: boolean };
  declined: { [id: string]: boolean };

  actions: {
    acceptInvitation: (notiInfo: any) =>void;
    declineInvitation: (notiInfo: any) => void;
  }
}

const initialState = {
  requestingsAccept: {},
  requestingsDecline: {},
  accepted: {},
  declined: {},
};

const myInvitationsStore = (set, get) => ({
  ...initialState,
  actions: {
    acceptInvitation: acceptInvitation(set, get),
    declineInvitation: declineInvitation(set, get),
  },
});

const useMyInvitationsStore = createStore<IMyInvitationsStore>(myInvitationsStore);

export default useMyInvitationsStore;

import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import acceptInvitation from './actions/acceptInvitation';
import declineInvitation from './actions/declineInvitation';

export interface INotiInvitationsStore extends IBaseState {
  requestingsAccept: { [id: string]: boolean };
  requestingsDecline: { [id: string]: boolean };
  accepted: { [id: string]: boolean };
  declined: { [id: string]: boolean };
  alreadyAccepted: { [id: string]: boolean };
  alreadyDeclined: { [id: string]: boolean };

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
  alreadyAccepted: {},
  alreadyDeclined: {},
};

const notiInvitationsStore = (set, get) => ({
  ...initialState,
  actions: {
    acceptInvitation: acceptInvitation(set, get),
    declineInvitation: declineInvitation(set, get),
  },
});

const useNotiInvitationsStore = createStore<INotiInvitationsStore>(notiInvitationsStore);

export default useNotiInvitationsStore;

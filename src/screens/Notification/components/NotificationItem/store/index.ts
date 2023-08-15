import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import acceptInvitation from './actions/acceptInvitation';
import declineInvitation from './actions/declineInvitation';

export interface INotiInvitationsStore extends IBaseState {
  requestingsAccept: { [id: string]: boolean };
  requestingsDecline: { [id: string]: boolean };
  needToChangeNote: { [id: string]: boolean };
  textNotedList: { [id: string]: string };

  actions: {
    acceptInvitation: (notiInfo: any) =>void;
    declineInvitation: (notiInfo: any) => void;
  }
}

const initialState = {
  requestingsAccept: {},
  requestingsDecline: {},
  needToChangeNote: {},
  textNotedList: {},
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

import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getTerms from './actions/getTerm';

export interface TermsInfo {
  groupId: string;
  rootGroupId: string;
  name: string;
  type: string;
  isActive: boolean;
}

export interface ITermState extends IBaseState {
  isOpen: boolean;
  type: string;
  groupId: string;
  rootGroupId: string;
  name: string;
  isActiveGroupTerms: boolean;
  loading: boolean;
  termContent: string;

  actions: {
    setIsOpen: (isOpen: boolean) => void;
    setTermInfo: (payload: TermsInfo) => void;
    getTerms: (groupId: string) => void;
  };
}

const initState: InitStateType<ITermState> = {
  type: '',
  isOpen: false,
  loading: true,
  isActiveGroupTerms: false,
  groupId: '',
  rootGroupId: '',
  name: '',
  termContent: '',
};

const termStore = (set, get) => ({
  ...initState,

  actions: {
    setIsOpen: (isOpen: boolean) => {
      set((state: ITermState) => {
        state.isOpen = isOpen;
      }, 'setIsOpen');
    },
    setTermInfo: (payload: TermsInfo) => {
      set((state: ITermState) => {
        state.isActiveGroupTerms = payload.isActive;
        state.groupId = payload.groupId;
        state.type = payload.type;
        state.rootGroupId = payload.rootGroupId;
        state.name = payload?.name || '';
      }, 'setTermInfo');
    },
    getTerms: getTerms(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useTermStore = createStore<ITermState>(termStore);

export default useTermStore;

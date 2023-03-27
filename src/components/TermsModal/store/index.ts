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
    setType: (type: string) => void;
    setGroupId: (groupId: string) => void;
    setIsActiveGroupTerms: (isActive: boolean) => void;
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
    setType: (type: string) => {
      set((state: ITermState) => {
        state.type = type;
      }, 'setType');
    },
    setGroupId: (groupId: string) => {
      set((state: ITermState) => {
        state.groupId = groupId;
      }, 'setGroupId');
    },
    setIsActiveGroupTerms: (isActive: boolean) => {
      set((state: ITermState) => {
        state.isActiveGroupTerms = isActive;
      }, 'setIsActiveGroupTerms');
    },
    setTermInfo: (payload: TermsInfo) => {
      set((state: ITermState) => {
        state.isActiveGroupTerms = payload.isActive;
        state.groupId = payload.groupId;
        state.type = payload.type;
        state.rootGroupId = payload.rootGroupId;
      }, 'setTermInfo');
    },
    getTerms: getTerms(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useTermStore = createStore<ITermState>(termStore);

export default useTermStore;

import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getTerms from './actions/getTerm';
import { MembershipAnswerRequest } from '~/interfaces/ICommunity';

export interface TermsInfo {
  groupId: string;
  rootGroupId: string;
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
  type: string;
  isActive: boolean;
  answers?: MembershipAnswerRequest[];
}

export interface ITermState extends IBaseState {
  isOpen: boolean;
  type: string;
  groupId: string;
  rootGroupId: string;
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
  isActiveGroupTerms: boolean;
  loading: boolean;
  termContent: string;
  errorText: string;
  answers: MembershipAnswerRequest[];

  actions: {
    setIsOpen: (isOpen: boolean) => void;
    setTermInfo: (payload: TermsInfo) => void;
    getTerms: (groupId: string, callBackError: ()=> void) => void;
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
  icon: '',
  privacy: '',
  userCount: 0,
  termContent: '',
  errorText: '',
  answers: [],
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
        state.name = payload?.name || initState.name;
        state.icon = payload?.icon || initState.icon;
        state.privacy = payload?.privacy || initState.privacy;
        state.userCount = payload?.userCount || initState.userCount;
        state.answers = payload?.answers || [];
      }, 'setTermInfo');
    },
    getTerms: getTerms(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useTermStore = createStore<ITermState>(termStore);

export default useTermStore;

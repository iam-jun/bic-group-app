import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getTerms from './actions/getTerm';
import { MembershipAnswerRequest } from '~/interfaces/ICommunity';
import getTermsData from './actions/getTermsData';

export interface TermsInfo {
  groupId: string;
  rootGroupId: string;
  name: string;
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
  isActiveGroupTerms: boolean;
  loading: boolean;
  termContent: string;
  errorText: string;
  answers: MembershipAnswerRequest[];
  data: {
    [groupId: string]: { content: string };
  };

  actions: {
    setIsOpen: (isOpen: boolean) => void;
    setTermInfo: (payload: TermsInfo) => void;
    getTerms: (groupId: string, callBackError: () => void) => void;
    getTermsData: (groupId: string) => Promise<void>;
    clearTermsByGroupId: (groupId: string) => void;
    clearTerms: () => void;
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
  errorText: '',
  answers: [],
  data: {},
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
        state.answers = payload?.answers || [];
      }, 'setTermInfo');
    },
    clearTermsByGroupId: (groupId: string) => {
      set((state: ITermState) => {
        state.data[groupId] = { content: '' };
      }, 'clearTermsByGroupId');
    },
    clearTerms: () => {
      set((state: ITermState) => {
        state.type = initState.type;
        state.isOpen = initState.isOpen;
        state.loading = initState.loading;
        state.isActiveGroupTerms = initState.isActiveGroupTerms;
        state.groupId = initState.groupId;
        state.rootGroupId = initState.rootGroupId;
        state.name = initState.name;
        state.termContent = initState.termContent;
        state.errorText = initState.errorText;
        state.answers = initState.answers;
      }, 'clearTerms');
    },
    getTerms: getTerms(set, get),
    getTermsData: getTermsData(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useTermStore = createStore<ITermState>(termStore);

export default useTermStore;

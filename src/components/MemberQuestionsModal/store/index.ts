import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getQuestions from './actions/getQuestions';
import { IMembershipQuestion, MembershipAnswerRequest } from '~/interfaces/ICommunity';

export interface MembershipQuestionsInfo {
  groupId: string;
  rootGroupId: string;
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
  type: string;
  isActive: boolean;
  isActiveGroupTerms: boolean;
}
export interface IMemberQuestionsState extends IBaseState {
  isOpen: boolean;
  type: string;
  groupId: string;
  rootGroupId: string;
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
  isActive: boolean;
  isActiveGroupTerms: boolean;
  loading: boolean;
  ids: string[];
  questions: {[id: string]: IMembershipQuestion};
  answers: {[id: string]: MembershipAnswerRequest};

  actions: {
    setIsOpen: (isOpen: boolean) => void;
    setMembershipQuestionsInfo: (payload: MembershipQuestionsInfo) => void;
    getQuestions: (groupId: string, callBackError: ()=> void) => void;
    setAnswer: (questionId: string, answer: string) => void;
  };
}
const initState: InitStateType<IMemberQuestionsState> = {
  type: '',
  isOpen: false,
  loading: true,
  isActive: false,
  isActiveGroupTerms: false,
  groupId: '',
  rootGroupId: '',
  name: '',
  icon: '',
  userCount: 0,
  privacy: '',
  ids: [],
  questions: {},
  answers: {},
};
const memberQuestionsStore = (set, get) => ({
  ...initState,
  actions: {
    setIsOpen: (isOpen: boolean) => {
      set((state: IMemberQuestionsState) => {
        state.isOpen = isOpen;
      }, 'setIsOpen');
    },
    setMembershipQuestionsInfo: (payload: MembershipQuestionsInfo) => {
      set((state: IMemberQuestionsState) => {
        state.isActiveGroupTerms = payload.isActiveGroupTerms;
        state.isActive = payload.isActive;
        state.groupId = payload.groupId;
        state.type = payload.type;
        state.rootGroupId = payload.rootGroupId;
        state.name = payload?.name || initState.name;
        state.icon = payload?.icon || initState.icon;
        state.privacy = payload?.privacy || initState.privacy;
        state.userCount = payload?.userCount || initState.userCount;
      }, 'setMembershipQuestionsInfo');
    },
    getQuestions: getQuestions(set, get),
    setAnswer: (questionId: string, answer: string) => {
      set((state: IMemberQuestionsState) => {
        state.answers[questionId] = {
          questionId,
          answer,
        };
      }, 'setAnswer');
    },
  },
  reset: () => resetStore(initState, set),
});
const useMemberQuestionsStore = createStore<IMemberQuestionsState>(memberQuestionsStore);
export default useMemberQuestionsStore;

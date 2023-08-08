import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ISummaryDetail, IUserParticipant } from '~/interfaces/IQuiz';
import getQuizSummary from './actions/getQuizSummary';

export interface IScoreboardState extends IBaseState {
  summaryDetail: ISummaryDetail;
  userParticipants: {
    data: IUserParticipant[];
    loading: boolean;
    refreshing: boolean;
    hasNextPage: boolean;
    endCursor?: string | null;
  };

  actions: {
    getQuizSummary: (quizId: string) => void;
    getUsersParticipants: (quizId: string) => void;
  },
}

const initState: InitStateType<IScoreboardState> = {
  summaryDetail: {
    contentId: null,
    participants: {
      total: 0,
      pass: 0,
      fail: 0,
    },
  },
  userParticipants: {
    data: [],
    loading: false,
    refreshing: false,
    hasNextPage: true,
    endCursor: null,
  },
};

const scoreboardStore = (set, get) => ({
  ...initState,

  actions: {
    getQuizSummary: getQuizSummary(set, get),
    // getUsersParticipants: getUsersParticipants(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useScoreboardStore = createStore<IScoreboardState>(scoreboardStore);

export default useScoreboardStore;

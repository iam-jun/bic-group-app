import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import {
  IPayloadStartQuiz,
  IPayLoadUpdateAnwsers,
  IParticipantResult,
  UserAnswerItem,
} from '~/interfaces/IQuiz';
import startQuiz from './actions/startQuiz';
import getQuizParticipant from './actions/getQuizParticipant';
import updateAnwsers from './actions/updateAnwsers';
import addToUserAnswers from './actions/addToUserAnswers';

export interface ITakeQuizState extends IBaseState {
  isPrepareTakingQuiz: boolean;
  quizParticipants: {
    [quizId: string]: string;
  };
  takingQuiz: {
    currentQuestionIndex: number;
    userAnswers: UserAnswerItem[];
  };
  participantResult: IParticipantResult;

  actions: {
    startQuiz: (payload: IPayloadStartQuiz) => void;
    getQuizParticipant: (quizParticipantId: string) => void;
    updateAnwsers: (payload: IPayLoadUpdateAnwsers) => void;

    onNext: () => void;
    onPrevious: () => void;
    addToUserAnswers: (payload: UserAnswerItem) => void;
    addToQuizParticipants: (quizId: string, participant: string) => void;
    setUserAnswersData: (payload: UserAnswerItem[]) => void;
    resetDataTakingQuiz: () => void;
  };
}

const initState = {
  isPrepareTakingQuiz: true,
  quizParticipants: {},
  takingQuiz: {
    currentQuestionIndex: 0,
    userAnswers: [],
  },
  participantResult: {},
};

const takeQuizStore = (set, get) => ({
  ...initState,

  actions: {
    startQuiz: startQuiz(set, get),
    getQuizParticipant: getQuizParticipant(set, get),
    updateAnwsers: updateAnwsers(set, get),

    onNext: () => {
      set((state: ITakeQuizState) => {
        state.takingQuiz.currentQuestionIndex += 1;
      }, 'onNext');
    },
    onPrevious: () => {
      set((state: ITakeQuizState) => {
        state.takingQuiz.currentQuestionIndex -= 1;
      }, 'onPrevious');
    },
    addToUserAnswers: addToUserAnswers(set, get),
    addToQuizParticipants: (quizId, participant) => {
      set((state: ITakeQuizState) => {
        state.quizParticipants[quizId] = participant;
      }, 'addToQuizParticipants');
    },
    setUserAnswersData: (payload: UserAnswerItem[]) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz.userAnswers = payload;
      }, 'setUserAnswersData');
    },
    resetDataTakingQuiz: () => {
      set((state: ITakeQuizState) => {
        state.takingQuiz.currentQuestionIndex = 0;
        state.takingQuiz.userAnswers = [];
      }, 'resetDataTakingQuiz');
    },
  },

  reset: () => resetStore(initState, set),
});

const useTakeQuizStore = createStore<ITakeQuizState>(takeQuizStore);

export default useTakeQuizStore;

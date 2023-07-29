import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import {
  IPayloadStartQuiz,
  IPayLoadUpdateAnwsers,
  ITakingQuizData,
} from '~/interfaces/IQuiz';
import startQuiz from './actions/startQuiz';
import getQuizParticipant from './actions/getQuizParticipant';
import updateAnwsers from './actions/updateAnwsers';

export interface ITakeQuizState extends IBaseState {
  isPrepareTakingQuiz: boolean;
  quizParticipants: {
    [quizId: string]: string;
  };
  takingQuiz: {
    currentQuestionIndex: number;
    data: ITakingQuizData;
  };

  actions: {
    startQuiz: (payload: IPayloadStartQuiz) => void;
    getQuizParticipant: (quizParticipantId: string) => void;
    updateAnwsers: (payload: IPayLoadUpdateAnwsers) => void;

    onNext: () => void;
    onPrevious: () => void;
    addToQuizParticipants: (quizId: string, participant: string) => void;
    resetDataTakingQuiz: () => void;
  };
}

const initState = {
  isPrepareTakingQuiz: true,
  quizParticipants: {},
  takingQuiz: {
    currentQuestionIndex: 0,
    data: {},
  },
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
    addToQuizParticipants: (quizId, participant) => {
      set((state: ITakeQuizState) => {
        state.quizParticipants[quizId] = participant;
      }, 'addToQuizParticipants');
    },
    resetDataTakingQuiz: () => {
      set((state) => {
        state.takingQuiz.currentQuestionIndex = 0;
        state.takingQuiz.data = {};
      }, 'resetDataTakingQuiz');
    },
  },

  reset: () => resetStore(initState, set),
});

const useTakeQuizStore = createStore<ITakeQuizState>(takeQuizStore);

export default useTakeQuizStore;

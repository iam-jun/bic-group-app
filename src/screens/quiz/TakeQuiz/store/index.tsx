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
    [participantId: string]: {
      currentQuestionIndex: number;
      userAnswers: UserAnswerItem[];
    }
  };
  participantResult: {
    [participantId: string]: IParticipantResult;
  }

  actions: {
    startQuiz: (payload: IPayloadStartQuiz) => void;
    getQuizParticipant: (quizParticipantId: string) => void;
    updateAnwsers: (payload: IPayLoadUpdateAnwsers) => void;

    initDataTakingQuiz: (participantId: string) => void;
    onNext: (participantId: string) => void;
    onPrevious: (participantId: string) => void;
    addToUserAnswers: (participantId: string, payload: UserAnswerItem) => void;
    addToQuizParticipants: (quizId: string, participant: string) => void;
    setUserAnswersData: (participantId: string, payload: UserAnswerItem[]) => void;
    resetDataTakingQuiz: (participantId: string) => void;
    clearQuizParticipantId: (quizId: string) => void;
  };
}

const initState = {
  isPrepareTakingQuiz: true,
  quizParticipants: {},
  takingQuiz: {},
  participantResult: {},
};

const takeQuizStore = (set, get) => ({
  ...initState,

  actions: {
    startQuiz: startQuiz(set, get),
    getQuizParticipant: getQuizParticipant(set, get),
    updateAnwsers: updateAnwsers(get),

    initDataTakingQuiz: (participantId: string) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz[participantId] = {
          currentQuestionIndex: 0,
          userAnswers: [],
        };
      }, `initDataTakingQuiz id ${participantId}`);
    },
    onNext: (participantId: string) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz[participantId].currentQuestionIndex += 1;
      }, `onNext id ${participantId}`);
    },
    onPrevious: (participantId: string) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz[participantId].currentQuestionIndex -= 1;
      }, `onPrevious id ${participantId}`);
    },
    addToUserAnswers: addToUserAnswers(set, get),
    addToQuizParticipants: (quizId, participant) => {
      set((state: ITakeQuizState) => {
        state.quizParticipants[quizId] = participant;
      }, 'addToQuizParticipants');
    },
    setUserAnswersData: (participantId: string, payload: UserAnswerItem[]) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz[participantId].userAnswers = payload;
      }, `setUserAnswersData id ${participantId}`);
    },
    resetDataTakingQuiz: (participantId: string) => {
      set((state: ITakeQuizState) => {
        state.takingQuiz[participantId].currentQuestionIndex = 0;
        // state.takingQuiz[participantId].userAnswers = [];
        // state.participantResult = {} as IParticipantResult;
      }, `resetDataTakingQuiz id ${participantId}`);
    },
    clearQuizParticipantId: (quizId: string) => {
      set((state: ITakeQuizState) => {
        state.quizParticipants[quizId] = null;
      }, 'clearQuizParticipantId');
    },
  },

  reset: () => resetStore(initState, set),
});

const useTakeQuizStore = createStore<ITakeQuizState>(takeQuizStore);

export default useTakeQuizStore;

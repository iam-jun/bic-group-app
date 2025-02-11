/* istanbul ignore file */
import {
  EditQuizActionsParams,
  FormGenerateQuiz,
  GenerateQuizParams,
  GetQuizDetailParams,
  IQuiz,
  QuestionItem,
  RegenerateQuizParams,
} from '~/interfaces/IQuiz';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import generateQuiz from './actions/generateQuiz';
import regenerateQuiz from './actions/regenerateQuiz';
import editQuiz from './actions/editQuiz';
import getQuizDetail from './actions/getQuizDetail';
import deleteQuiz from './actions/deleteQuiz';
import deleteQuizLocal from './actions/deleteQuizLocal';
import deleteQuestionQuiz from './actions/deleteQuestionQuiz';
import createQuestionQuiz from './actions/createQuestionQuiz';
import editQuestionQuiz from './actions/editQuestionQuiz';

export interface IQuizzesState extends IBaseState {
  formGenerateQuiz: FormGenerateQuiz;
  waitingProcessingQuiz: string | null;
  loading: boolean;
  isGenerating: boolean;
  isGettingQuizDetail: boolean;
  data: {
    [quizId: string]: IQuiz;
  };
  actions: {
    setFormGenerateQuiz: (formGenerateQuiz: FormGenerateQuiz) => void;
    setWaitingProcessingQuiz: (quizId: string | null) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    generateQuiz: (params: GenerateQuizParams, onSuccess?: (quiz: IQuiz) => void) => void;
    regenerateQuiz: (quizId: string, params?: RegenerateQuizParams) => void;
    editQuiz: (params: EditQuizActionsParams) => void;
    getQuizDetail: (params: GetQuizDetailParams) => void;
    addOrUpdateQuiz: (quiz: IQuiz) => void;
    removeQuizLocal: (quizId: string) => void;
    deleteQuiz: (quizId: string, contentId: string) => void;
    deleteQuizLocal?: (quizId: string) => void;
    deleteQuestionQuiz: (quizId: string, questionId: string) => void;
    createQuestionQuiz: (quizId: string, question: QuestionItem) => void;
    editQuestionQuiz: (quizId: string, question: QuestionItem) => void;
  };
}

const initState: InitStateType<IQuizzesState> = {
  formGenerateQuiz: {},
  waitingProcessingQuiz: null,
  loading: false,
  isGenerating: false,
  isGettingQuizDetail: false,
  data: {},
};

const quizzesStore = (set, get): IQuizzesState => ({
  ...initState,
  actions: {
    setFormGenerateQuiz: (formGenerateQuiz: FormGenerateQuiz) => {
      set((state: IQuizzesState) => {
        state.formGenerateQuiz = {
          ...state.formGenerateQuiz,
          ...formGenerateQuiz,
        };
      }, 'setFormGenerateQuiz');
    },
    setWaitingProcessingQuiz: (quizId: string | null) => {
      set((state: IQuizzesState) => {
        state.waitingProcessingQuiz = quizId;
      }, 'setWaitingProcessingQuiz');
    },
    setIsGenerating: (isGenerating: boolean) => {
      set((state: IQuizzesState) => {
        state.isGenerating = isGenerating;
      }, 'setIsGenerating');
    },
    generateQuiz: generateQuiz(set, get),
    regenerateQuiz: regenerateQuiz(set, get),
    editQuiz: editQuiz(set, get),
    getQuizDetail: getQuizDetail(set, get),
    addOrUpdateQuiz: (quiz: IQuiz) => {
      const { id } = quiz;
      set((state: IQuizzesState) => {
        state.data[id] = quiz;
      }, 'addOrUpdateQuiz');
    },
    removeQuizLocal: (quizId: string) => {
      set((state: IQuizzesState) => {
        delete state.data[quizId];
      }, 'removeQuizLocal');
    },
    deleteQuiz: deleteQuiz(set, get),
    deleteQuizLocal: deleteQuizLocal(get),
    deleteQuestionQuiz: deleteQuestionQuiz(set, get),
    createQuestionQuiz: createQuestionQuiz(set, get),
    editQuestionQuiz: editQuestionQuiz(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useQuizzesStore = createStore<IQuizzesState>(quizzesStore);

export default useQuizzesStore;

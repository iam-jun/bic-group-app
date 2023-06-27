import { GenerateQuizParams, IQuiz } from '~/interfaces/IQuiz';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import generateQuiz from './actions/generateQuiz';

export interface IQuizzesState extends IBaseState {
    loading: boolean;
    isGenerating: boolean;
    data: {
        [contentId: string]: IQuiz;
    }
    actions: {
        generateQuiz: (params: GenerateQuizParams) => void;
        addOrUpdateQuiz: (quiz: IQuiz) => void;
        removeQuiz: (contentId: string) => void;
    }
}

const initState: InitStateType<IQuizzesState> = {
  loading: false,
  isGenerating: false,
  data: {},
};

const quizzesStore = (set, get): IQuizzesState => ({
  ...initState,
  actions: {
    generateQuiz: generateQuiz(set, get),
    addOrUpdateQuiz: (quiz: IQuiz) => {
      const { contentId } = quiz;
      set((state: IQuizzesState) => {
        state.data[contentId] = quiz;
      }, 'addOrUpdateQuiz');
    },
    removeQuiz: (contentId: string) => {
      set((state: IQuizzesState) => {
        delete state.data[contentId];
      }, 'removeQuiz');
    },
  },
  reset: () => resetStore(initState, set),
});

const useQuizzesStore = createStore<IQuizzesState>(quizzesStore);

export default useQuizzesStore;

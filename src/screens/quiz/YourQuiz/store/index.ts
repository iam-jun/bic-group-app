import { createStore, resetStore } from '~/store/utils';
import IBaseState, { IBaseListState, InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import { Pagination } from '~/store/interfaces/IFetchingState';
import { ContentQuiz, AttributeQuiz } from '~/interfaces/IQuiz';
import getQuizzesContent from './actions/getQuizzesContent';

const DEFAULT_DATA: IQuizContentFilter = {
  ids: [],
  loading: false,
  refreshing: false,
  hasNextPage: true,
  endCursor: null,
};

export type IQuizContentFilter = IBaseListState<IPost> & Pagination;

export interface IYourQuizState extends IBaseState {
  contentFilter: ContentQuiz;
  attributeFilter: AttributeQuiz;
  data: { [T in ContentQuiz]: { [S in AttributeQuiz]: IQuizContentFilter } }

  actions: {
    setContentFilterQuiz: (contentFilter: ContentQuiz) => void;
    setAttributeFilterQuiz: (attributeFilter: AttributeQuiz) => void;
    getQuizzesContent: (isRefresh?: boolean) => void;
  },
}

const initData = Object.values(ContentQuiz).reduce((acc, valueContentQuiz) => {
  const data: any = { [valueContentQuiz]: {} };
  Object.values(AttributeQuiz).forEach((valueAttributeQuiz) => {
    data[valueContentQuiz][valueAttributeQuiz] = DEFAULT_DATA;
  });
  return {
    ...acc,
    ...data,
  };
}, {});

const initState: InitStateType<IYourQuizState> = {
  contentFilter: ContentQuiz.ALL,
  attributeFilter: AttributeQuiz.DRAFT,
  data: initData,
};

const yourQuizStore = (set, get) => ({
  ...initState,

  actions: {
    setContentFilterQuiz: (contentFilter: ContentQuiz) => {
      set((state: IYourQuizState) => {
        state.contentFilter = contentFilter;
      }, 'setContentFilter Quiz');
    },
    setAttributeFilterQuiz: (attributeFilter: AttributeQuiz) => {
      set((state: IYourQuizState) => {
        state.attributeFilter = attributeFilter;
      }, 'setAttributeFilter Quiz');
    },

    getQuizzesContent: getQuizzesContent(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useYourQuizStore = createStore<IYourQuizState>(yourQuizStore);

export default useYourQuizStore;

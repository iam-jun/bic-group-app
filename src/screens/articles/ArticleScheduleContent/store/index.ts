import { createStore, resetStore } from '~/store/utils';
import getArticleScheduleContent from './actions/getArticleScheduleContent';
import { IPost } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { IPayloadGetArticleScheduleContent } from '~/interfaces/IArticle';

export interface IArticleScheduleContentState extends IBaseState, IFetchingState {
  articles: IPost[];

  actions?: {
    getArticleScheduleContent: (payload: IPayloadGetArticleScheduleContent) => void;
    clearArticleScheduleContent: () => void;
  };
}

const initialState: IArticleScheduleContentState = {
  articles: [],
  hasNextPage: true,
  loading: false,
  refreshing: false,
};

const articleScheduleContentStore = (set, get) => ({
  ...initialState,

  actions: {
    getArticleScheduleContent: getArticleScheduleContent(set, get),
    clearArticleScheduleContent: () => {
      set((state: IArticleScheduleContentState) => {
        state.articles = initialState.articles;
        state.hasNextPage = initialState.hasNextPage;
        state.loading = initialState.loading;
        state.refreshing = initialState.refreshing;
      }, 'clearArticleScheduleContent');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useArticleScheduleContentStore = createStore<IArticleScheduleContentState>(articleScheduleContentStore);

export default useArticleScheduleContentStore;

import { createStore, resetStore } from '~/store/utils';
import { IGetSeries } from '~/interfaces/ISeries';
import IBaseState from '~/store/interfaces/IBaseState';
import searchArticles from './actions/searchArticles';
import addArticles from './actions/addArticles';
import { IPostArticles } from '~/interfaces/IPost';

export interface ISelectingArticles {
  [x: string]: IPostArticles;
}

export interface IAddArticlesState extends IBaseState {
  key: string;
  loading: boolean;
  items: any[];
  hasNextPage: boolean;
  selectingArticles: ISelectingArticles;

  actions: {
    setSearchKey: (text: string) => void;
    setSelectingArticles: (data: ISelectingArticles) => void;
    setSelectingArticle: (data: IPostArticles) => void;
    searchArticles: (params: IGetSeries, isLoadMore?: boolean) => void;
    addArticles: (seriesId: string, article: IPostArticles) => void;
  }
}

const initialState = {
  key: '',
  loading: false,
  items: [],
  hasNextPage: true,
  selectingArticles: {},
};

const useEditArticleInSeries = (set, get) => ({
  ...initialState,

  actions: {
    setSearchKey: (text: string) => {
      set((state: IAddArticlesState) => {
        state.key = text;
      }, 'setSearchKey');
    },
    setSelectingArticles: (data: ISelectingArticles) => {
      set((state: IAddArticlesState) => {
        state.selectingArticles = data;
      }, 'setSelectingArticles');
    },
    setSelectingArticle: (item: IPostArticles) => {
      set((state: IAddArticlesState) => {
        state.selectingArticles[item.id] = item;
      }, 'setSelectingArticle');
    },
    searchArticles: searchArticles(set, get),
    addArticles: addArticles(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useAddArticlesStore = createStore<IAddArticlesState>(useEditArticleInSeries);

export default useAddArticlesStore;

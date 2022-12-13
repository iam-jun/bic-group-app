import IBaseState from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import deleteArticle from './actions/deleteArticle';

export interface ISeriesDetailArticleItemState extends IBaseState{
  actions?: {
    deleteArticle: (seriesId: string, articleId: string) => void;
  }
}

const useSeriesDetailArticleItem = (set, get) => ({
  actions: {
    deleteArticle: deleteArticle(set, get),
  },
});

const useSeriesDetailArticleItemStore = createStore<ISeriesDetailArticleItemState>(useSeriesDetailArticleItem);

export default useSeriesDetailArticleItemStore;

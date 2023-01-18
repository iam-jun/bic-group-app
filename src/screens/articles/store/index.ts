import { createStore } from '~/store/utils';
import deleteArticle from './actions/deleteArticle';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IArticleController extends IBaseState {
  actions: {
    deleteArticle: (id: string, successMessage?: string) => void;
  }
}

const articleController = (set, get) => ({
  actions: {
    deleteArticle: deleteArticle(set, get),
  },
});

const useArticleController = createStore<IArticleController>(articleController);

export default useArticleController;

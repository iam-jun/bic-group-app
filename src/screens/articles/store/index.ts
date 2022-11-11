import { createStore } from '~/store/utils';
import deleteArticle from './actions/deleteArticle';
import { IPayloadDeleteArticle } from '~/interfaces/IArticle';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IArticleController extends IBaseState {
  actions: {
    deleteArticle: (payload: IPayloadDeleteArticle) => void;
  }
}

const articleController = (set, get) => ({
  actions: {
    deleteArticle: deleteArticle(set, get),
  },
});

const useArticleController = createStore<IArticleController>(articleController);

export default useArticleController;

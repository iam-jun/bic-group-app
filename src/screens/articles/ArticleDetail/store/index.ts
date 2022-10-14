import { IObject } from '~/interfaces/common';
import IBaseState from '~/store/interfaces/IBaseState';
import {
  resetStore,
  createStore,
} from '~/store/utils';
import getArticleDetail from './actions/getArticleDetail';

export interface IArticlesState extends IBaseState {
  requestings: IObject<boolean>;
  actions: {
    getArticleDetail: (id: string) => void,
  }
}

const initialState = {
  requestings: {},
};

const articlesStore = (set, get) => ({
  ...initialState,
  actions: {
    getArticleDetail: getArticleDetail(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useArticlesStore = createStore<IArticlesState>(articlesStore);

export default useArticlesStore;

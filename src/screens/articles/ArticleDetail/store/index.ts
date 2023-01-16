import { IObject } from '~/interfaces/common';
import IBaseState from '~/store/interfaces/IBaseState';
import {
  resetStore,
  createStore,
} from '~/store/utils';
import getArticleDetail from './actions/getArticleDetail';

export interface IArticlesState extends IBaseState {
  requestings: IObject<boolean>;
  errors: IObject<boolean>;

  actions: {
    getArticleDetail: (id: string, isReported?: boolean) => void,
  }
}

const initialState = {
  requestings: {},
  errors: {},
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

import { createStore, resetStore } from '~/store/utils';
import { IPost } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';
import getArticlesByTag from './actions/getArticlesByTag';
import { IPayloadGetSearchPosts } from '~/interfaces/IHome';

export interface ITagDetailState extends IBaseState, IFetchingState {
  articles: IPost[],
  hasNextPage: boolean,
  loading: boolean,
  refreshing: boolean,

  actions:{
    getArticles?: (payload: IPayloadGetSearchPosts, isLoadMore?: boolean) => void;
  }
}

const initialState: InitStateType<ITagDetailState> = {
  articles: [],
  hasNextPage: true,
  loading: true,
  refreshing: false,
};

const tagDetailStore = (set, get) => ({
  ...initialState,

  actions: {
    getArticles: getArticlesByTag(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useTagDetailStore = createStore<ITagDetailState>(tagDetailStore);

export default useTagDetailStore;

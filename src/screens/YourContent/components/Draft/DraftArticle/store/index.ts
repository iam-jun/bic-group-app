import { createStore, resetStore } from '~/store/utils';
import getDraftArticles from './actions/getDraftArticles';
import publishDraftArticle from './actions/publishDraftArticle';
import { IPayloadPublishDraftArticle } from '~/interfaces/IArticle';
import { IPayloadGetDraftContents, IPost } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDraftArticleState extends IBaseState, IFetchingState {
  articles: IPost[],
  hasNextPage: boolean,
  endCursor: string,
  loading: boolean,
  refreshing: boolean,
  isPublishing: boolean;

  actions?:{
    getDraftArticles?: (payload: IPayloadGetDraftContents) => void;
    publishDraftArticle?: (payload: IPayloadPublishDraftArticle) => void;
  }
}

const initialState: IDraftArticleState = {
  articles: [],
  hasNextPage: true,
  endCursor: '',
  loading: false,
  refreshing: false,
  isPublishing: false,
};

const draftArticleStore = (set, get) => ({
  ...initialState,

  actions: {
    getDraftArticles: getDraftArticles(set, get),
    publishDraftArticle: publishDraftArticle(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useDraftArticleStore = createStore<IDraftArticleState>(draftArticleStore);

export default useDraftArticleStore;

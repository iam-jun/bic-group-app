import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import { ITopicDetail, IPayloadGetArticleTopicDetail } from '~/interfaces/ITopic';
import IFetchingState from '~/store/interfaces/IFetchingState';
import getTopicDetail from './actions/getTopicDetail';
import getArticleTopicDetail from './actions/getArticleTopicDetail';

export interface ITopicState extends IBaseState, IFetchingState {
    topicDetail: ITopicDetail;
    articles: {
      data: IPost[];
      loading: boolean;
      refreshing: boolean,
      total: number,
      hasNextPage: boolean,
    };

    actions: {
        getTopicDetail: (payload: string) => void;
        getArticleTopicDetail: (payload: IPayloadGetArticleTopicDetail) => void;
    };
}

const initState: InitStateType<ITopicState> = {
  topicDetail: {
    id: '',
    name: '',
  },
  articles: {
    data: [],
    loading: false,
    refreshing: false,
    total: 0,
    hasNextPage: true,
  },
};

const topicStore = (set, get) => ({
  ...initState,

  actions: {
    getTopicDetail: getTopicDetail(set),
    getArticleTopicDetail: getArticleTopicDetail(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useTopicStore = createStore<ITopicState>(topicStore);

export default useTopicStore;

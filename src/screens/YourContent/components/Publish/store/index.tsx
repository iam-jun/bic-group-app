import { createStore, resetStore } from '~/store/utils';
import IBaseState, { IBaseListState } from '~/store/interfaces/IBaseState';
import { IPost, IPayloadGetPublishContents } from '~/interfaces/IPost';
import { ContentFeed } from '~/interfaces/IFeed';
import getPublishContent from './actions/getPublishContent';

const DEFAULT_DATA: IBaseListState<IPost> = {
  ids: [],
  loading: false,
  refreshing: false,
  hasNextPage: true,
};

const initData = Object.values(ContentFeed).reduce((acc, valueContentFeed) => {
  const data = { [valueContentFeed]: DEFAULT_DATA };
  return { ...acc, ...data };
}, {});

export interface IPublishState extends IBaseState {
    publishContents: { [T in ContentFeed]: IBaseListState<IPost> };

    actions: {
        getPublishContent: (payload: IPayloadGetPublishContents) => void;
    };
}

const initState = {
  publishContents: initData,
};

const publishStore = (set, get) => ({
  ...initState,

  actions: {
    getPublishContent: getPublishContent(set, get),
  },

  reset: () => resetStore(initState, set),
});

const usePublishStore = createStore<IPublishState>(publishStore);

export default usePublishStore;

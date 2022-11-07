import getDataFeed from '~/screens/Home/store/actions/getDataFeed';
import IHomeState, {
  ATTRIBUTE_FEED,
  CONTENT_FEED,
  IHomeFeed,
} from '~/screens/Home/store/Interface';
import { createStore, resetStore } from '~/store/utils';

const DEFAULT_DATA: IHomeFeed = {
  isLoading: false,
  refreshing: false,
  data: [],
  canLoadMore: true,
};

const initFeed = Object.values(CONTENT_FEED).reduce((acc, valueContentFeed) => {
  const feed: any = { [valueContentFeed]: {} };
  Object.values(ATTRIBUTE_FEED).forEach((valueAttributeFeed) => {
    feed[valueContentFeed][valueAttributeFeed] = DEFAULT_DATA;
  });
  return {
    ...acc,
    ...feed,
  };
}, {});

const initState: IHomeState = {
  contentFilter: CONTENT_FEED.ALL,
  attributeFilter: ATTRIBUTE_FEED.ALL,
  feed: initFeed,
};

const homeStore = (set, get) => ({
  ...initState,

  actions: {
    setContentFilter: (contentFilter: CONTENT_FEED) => {
      set((state: IHomeState) => {
        state.contentFilter = contentFilter;
      }, 'setContentFilter');
    },
    setAttributeFilter: (attributeFilter: ATTRIBUTE_FEED) => {
      set((state: IHomeState) => {
        state.attributeFilter = attributeFilter;
      }, 'setAttributeFilter');
    },
    setDataFeed: (
      data: IHomeFeed,
      contentFilter?: CONTENT_FEED,
      attributeFilter?: ATTRIBUTE_FEED,
    ) => {
      const {
        contentFilter: currentContentFilter,
        attributeFilter: currentAttributeFilter,
      } = get();
      const content = contentFilter || currentContentFilter;
      const attribute = attributeFilter || currentAttributeFilter;

      set((state: IHomeState) => {
        state.feed[content][attribute] = {
          ...state.feed[content][attribute],
          ...data,
        };
      }, 'setDataFeed');
    },
    refreshHome: () => {
      const { actions }: IHomeState = get();
      set((state: IHomeState) => {
        state.contentFilter = CONTENT_FEED.ALL;
        state.attributeFilter = ATTRIBUTE_FEED.ALL;
      }, 'refreshHome');
      actions.getDataFeed(true);
    },

    getDataFeed: getDataFeed(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useHomeStore = createStore<IHomeState>(homeStore);

export default useHomeStore;

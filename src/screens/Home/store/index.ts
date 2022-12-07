import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import getDataFeed from '~/screens/Home/store/actions/getDataFeed';
import IHomeState, { IHomeFeed } from '~/screens/Home/store/Interface';
import { createStore, resetStore } from '~/store/utils';

const DEFAULT_DATA: IHomeFeed = {
  isLoading: false,
  refreshing: false,
  data: [],
  canLoadMore: true,
};

const initFeed = Object.values(ContentFeed).reduce((acc, valueContentFeed) => {
  const feed: any = { [valueContentFeed]: {} };
  Object.values(AttributeFeed).forEach((valueAttributeFeed) => {
    feed[valueContentFeed][valueAttributeFeed] = DEFAULT_DATA;
  });
  return {
    ...acc,
    ...feed,
  };
}, {});

const initState: IHomeState = {
  contentFilter: ContentFeed.ALL,
  attributeFilter: AttributeFeed.ALL,
  feed: initFeed,
};

const homeStore = (set, get) => ({
  ...initState,

  actions: {
    setContentFilter: (contentFilter: ContentFeed) => {
      set((state: IHomeState) => {
        state.contentFilter = contentFilter;
      }, 'setContentFilter');
    },
    setAttributeFilter: (attributeFilter: AttributeFeed) => {
      set((state: IHomeState) => {
        state.attributeFilter = attributeFilter;
      }, 'setAttributeFilter');
    },
    setDataFeed: (
      data: IHomeFeed,
      contentFilter?: ContentFeed,
      attributeFilter?: AttributeFeed,
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
        state.contentFilter = ContentFeed.ALL;
        state.attributeFilter = AttributeFeed.ALL;
      }, 'refreshHome');
      actions.getDataFeed(true);
    },

    getDataFeed: getDataFeed(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useHomeStore = createStore<IHomeState>(homeStore);

export default useHomeStore;

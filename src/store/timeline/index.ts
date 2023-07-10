import {
  createStore, resetStore,
} from '~/store/utils';
import getPosts from './actions/getPosts';
import { IPost } from '~/interfaces/IPost';
import IBaseState, { IBaseListState } from '../interfaces/IBaseState';
import { ContentFeed, AttributeFeed } from '~/interfaces/IFeed';
import { Pagination } from '../interfaces/IFetchingState';

const DEFAULT_DATA: IDataFilterTimelines = {
  ids: [],
  loading: false,
  refreshing: false,
  hasNextPage: true,
  endCursor: null,
};

export type IDataFilterTimelines = IBaseListState<IPost> & Pagination;
export interface ITimelines {
  contentFilter: ContentFeed;
  attributeFilter: AttributeFeed;
  data: { [T in ContentFeed]: { [S in AttributeFeed]: IDataFilterTimelines } };
}

export interface ITimelineState extends IBaseState {
    timelines: { [x: string]: ITimelines };
    actions:{
      setContentFilter?: (id: string, contentFilter: ContentFeed) => void;
      setAttributeFilter?: (id: string, attributeFilter: AttributeFeed) => void;
      initDataTimeline: (id: string) => void;
      getPosts: (id: string, isRefresh?: boolean) => void;
      resetTimeline: (id?: string) => void;
    }
}

export const initData = Object.values(ContentFeed).reduce((acc, valueContentFeed) => {
  const data: any = { [valueContentFeed]: {} };
  Object.values(AttributeFeed).forEach((valueAttributeFeed) => {
    data[valueContentFeed][valueAttributeFeed] = DEFAULT_DATA;
  });
  return {
    ...acc,
    ...data,
  };
}, {});

const initialState = {
  timelines: {},
};

const timelineStore = (set, get) => ({
  ...initialState,
  actions: {
    setContentFilter: (id: string, contentFilter: ContentFeed) => {
      set((state: ITimelineState) => {
        state.timelines[id].contentFilter = contentFilter;
      }, `setContentFilterTimeline Community/Group id: ${id}`);
    },
    setAttributeFilter: (id: string, attributeFilter: AttributeFeed) => {
      set((state: ITimelineState) => {
        state.timelines[id].attributeFilter = attributeFilter;
      }, `setAttributeFilterTimeline Community/Group id: ${id}`);
    },
    initDataTimeline: (id: string) => {
      set((state: ITimelineState) => {
        state.timelines[id] = {
          contentFilter: ContentFeed.ALL,
          attributeFilter: AttributeFeed.ALL,
          data: initData,
        };
      }, `initDataTimeline Community/Group id: ${id}`);
    },
    getPosts: getPosts(set, get),
    resetTimeline: (id: string) => {
      set((state) => {
        state.timelines[id] = {};
      }, `resetTimeline Community/Group id: ${id}`);
    },
  },
  reset: () => resetStore(initialState, set),
});

const useTimelineStore = createStore<ITimelineState>(timelineStore);

export default useTimelineStore;

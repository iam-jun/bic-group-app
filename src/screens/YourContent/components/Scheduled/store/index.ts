import { ScheduledFeed } from '~/interfaces/IFeed';
import IBaseState, { IBaseListState } from '~/store/interfaces/IBaseState';
import { Pagination } from '~/store/interfaces/IFetchingState';
import { createStore, resetStore } from '~/store/utils';
import getScheduledContents from './actions/getScheduledContents';

export type IScheduledContentsFilter = IBaseListState<string> & Pagination;

const DEFAULT_DATA: IScheduledContentsFilter = {
  ids: [],
  loading: false,
  refreshing: false,
  hasNextPage: true,
  endCursor: null,
};

const initData = Object.values(ScheduledFeed).reduce((acc, value) => {
  const data = { [value]: DEFAULT_DATA };
  return { ...acc, ...data };
}, {});

export interface IScheduledContentsState extends IBaseState {
  scheduledFeed: { [T in ScheduledFeed]: IScheduledContentsFilter };
  actions: {
    getScheduledContents: (feed: ScheduledFeed, isRefresh?: boolean) => void;
    refreshAllFeeds: () => void;
  };
}

const initState: any = {
  scheduledFeed: initData,
};

const scheduledContentsStore = (set, get): IScheduledContentsState => ({
  ...initState,
  actions: {
    getScheduledContents: getScheduledContents(set, get),
    refreshAllFeeds: () => {
      const { actions }: IScheduledContentsState = get();

      Object.values(ScheduledFeed).forEach((feed) => {
        actions.getScheduledContents(feed, true);
      });
    },
  },
  reset: () => resetStore(initState, set),
});

const useScheduledContentsStore = createStore<IScheduledContentsState>(
  scheduledContentsStore,
);

export default useScheduledContentsStore;

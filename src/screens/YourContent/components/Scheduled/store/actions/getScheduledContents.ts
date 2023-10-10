import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import { IScheduledContentsFilter, IScheduledContentsState } from '../index';
import { getParamsContentFeed } from '~/screens/Home/store/helper';
import showToastError from '~/store/helper/showToastError';
import { IParamGetFeed } from '~/interfaces/IHome';
import { ScheduledFeed } from '~/interfaces/IFeed';

const getScheduledContents = (set, get) => async (feed: ScheduledFeed, isRefresh?: boolean) => {
  const { scheduledFeed }: IScheduledContentsState = get();
  const currentContents: IScheduledContentsFilter = scheduledFeed[feed];

  if (!isRefresh && (currentContents.loading || !currentContents.hasNextPage)) return;

  set((state: IScheduledContentsState) => {
    state.scheduledFeed[feed] = {
      ...state.scheduledFeed[feed],
      refreshing: isRefresh,
      loading: !isRefresh,
    };
  }, 'getScheduledContents');

  try {
    const endCursor = isRefresh ? null : currentContents.endCursor;
    const params: IParamGetFeed = {
      after: endCursor,
      type: getParamsContentFeed(feed),
    };
    const response = await streamApi.getScheduledContents(params);

    const lstScheduledContents = response?.data?.list || [];
    usePostsStore.getState().actions.addToPosts({ data: lstScheduledContents });

    const lstScheduledContentsIds = lstScheduledContents.map((item) => item.id);
    const newIds = isRefresh ? lstScheduledContentsIds : [...currentContents.ids, ...lstScheduledContentsIds];

    set((state: IScheduledContentsState) => {
      state.scheduledFeed[feed] = {
        ...state.scheduledFeed[feed],
        loading: false,
        refreshing: false,
        ids: newIds,
        hasNextPage: response?.data?.meta?.hasNextPage || false,
        endCursor: response?.data?.meta?.endCursor || null,
      };
    }, 'action getScheduledContents Success');
  } catch (e) {
    set((state: IScheduledContentsState) => {
      state.scheduledFeed[feed] = {
        ...state.scheduledFeed[feed],
        loading: false,
        refreshing: false,
      };
    }, 'action getScheduledContents Failed');
    console.error('\x1b[31m🐣️ action getScheduledContents error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getScheduledContents;

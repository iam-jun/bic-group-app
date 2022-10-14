import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IManagedState } from '../Interface';

const getManagedCommunityAndGroup
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { ids, items, hasNextPage } = get().manage;

      if (!isRefreshing && !hasNextPage) return;

      set((state: IManagedState) => {
        state.manage.loading = !isRefreshing;
      },
      'getManagedCommunityAndGroupFetching');

      const params = {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
      };
      const response = await groupApi.getManagedCommunityAndGroup(params);

      if (!response.data) {
        throw new Error('Incorrect response');
      }

      const { data, meta } = response;
      const newIds = data.map((item) => item.id);
      const newItems = data.reduce(
        (accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: currentItem,
        }),
        {},
      );

      set((state: IManagedState) => {
        state.manage.ids = isRefreshing ? newIds : [...ids, ...newIds];
        state.manage.items = isRefreshing ? newItems : { ...items, ...newItems };
        state.manage.loading = false;
        state.manage.hasNextPage = meta.hasNextPage;
      },
      'getManagedCommunityAndGroupSuccess');
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ getManagedCommunityAndGroup error: ',
        e,
        '\x1b[0m',
      );
      set(
        (state: IManagedState) => {
          state.manage.loading = false;
        },
        'getManagedCommunityAndGroupFailed',
      );
    }
  };

export default getManagedCommunityAndGroup;

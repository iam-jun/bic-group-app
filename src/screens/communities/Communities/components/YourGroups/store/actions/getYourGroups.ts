import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';

const getYourGroups
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { ids, items, hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;

      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'getYourGroupsFetching',
      );

      const params = {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
      };
      const response = await groupApi.getJoinedAllGroups(params);

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

      set(
        {
          ids: isRefreshing ? newIds : [...ids, ...newIds],
          items: isRefreshing ? newItems : { ...items, ...newItems },
          loading: false,
          refreshing: false,
          hasNextPage: meta.hasNextPage,
        },
        'getYourGroupsSuccess',
      );
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ getYourGroups error: ',
        e,
        '\x1b[0m',
      );
      set(
        {
          loading: false,
          refreshing: false,
        },
        'getYourGroupsFailed',
      );
    }
  };

export default getYourGroups;

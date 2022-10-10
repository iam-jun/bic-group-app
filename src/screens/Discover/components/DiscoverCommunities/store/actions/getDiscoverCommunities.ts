import groupApi from '~/api/GroupApi';
import { IParamGetCommunities } from '~/interfaces/ICommunity';

const getDiscoverCommunities
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { ids, items, hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;

      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'doGetDiscoverCommunitiesFetching',
      );

      const params: IParamGetCommunities = {
        limit: 21,
        offset: isRefreshing ? 0 : ids.length,
        sort: 'name:asc',
      };
      const response = await groupApi.getDiscoverCommunities(params);

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
        'doGetDiscoverCommunitiesSuccess',
      );
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ doGetDiscoverCommunities error: ',
        e,
        '\x1b[0m',
      );
      set(
        {
          loading: false,
          refreshing: false,
        },
        'doGetDiscoverCommunitiesFailed',
      );
    }
  };

export default getDiscoverCommunities;

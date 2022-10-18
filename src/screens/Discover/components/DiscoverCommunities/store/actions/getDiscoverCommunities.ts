import groupApi from '~/api/GroupApi';
import { IParamGetCommunities } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';

const PAGE_SIZE = 21;
const ORDER_BY = 'name:asc';

const getDiscoverCommunities
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { ids, hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;

      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'doGetDiscoverCommunitiesFetching',
      );

      const params: IParamGetCommunities = {
        limit: PAGE_SIZE,
        offset: isRefreshing ? 0 : ids.length,
        sort: ORDER_BY,
      };
      const response = await groupApi.getDiscoverCommunities(params);

      if (!response.data) {
        throw new Error('Incorrect response');
      }

      const { data, meta } = response;
      const newIds = data.map((item) => item.id);

      useCommunitiesStore.getState().actions.addCommunity(data);

      set(
        {
          ids: isRefreshing ? newIds : [...ids, ...newIds],
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

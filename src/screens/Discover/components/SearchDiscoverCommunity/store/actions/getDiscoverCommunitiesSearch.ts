import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IParamGetCommunities } from '~/interfaces/ICommunity';

const getDiscoverCommunitiesSearch = (set, get) => async (params: IParamGetCommunities) => {
  try {
    const { ids, items, hasNextPage } = get();

    if (!hasNextPage) return;

    set(
      {
        loading: true,
      },
      'getDiscoverCommunitiesSearchFetching',
    );

    const response = await groupApi.getDiscoverCommunities({
      limit: appConfig.recordsPerPage,
      offset: ids.length,
      ...params,
    });

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
        ids: [...ids, ...newIds],
        items: { ...items, ...newItems },
        loading: false,
        hasNextPage: meta.hasNextPage,
      },
      'getDiscoverCommunitiesSearchSuccess',
    );
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ getDiscoverCommunitiesSearch error: ',
      e,
      '\x1b[0m',
    );
    set(
      {
        loading: false,
        refreshing: false,
      },
      'getDiscoverCommunitiesSearchFailed',
    );
  }
};

export default getDiscoverCommunitiesSearch;

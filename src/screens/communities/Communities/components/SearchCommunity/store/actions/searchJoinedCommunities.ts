import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IParamGetCommunities } from '~/interfaces/ICommunity';

const searchJoinedCommunities = (set, get) => async (params: IParamGetCommunities) => {
  try {
    const { ids, items, hasNextPage } = get();

    if (!hasNextPage) return;

    set(
      {
        loading: true,
      },
      'searchJoinedCommunitiesFetching',
    );

    const response = await groupApi.searchJoinedCommunities({
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
      'searchJoinedCommunitiesSuccess',
    );
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ searchJoinedCommunities error: ',
      e,
      '\x1b[0m',
    );
    set(
      {
        loading: false,
        refreshing: false,
      },
      'searchJoinedCommunitiesFailed',
    );
  }
};

export default searchJoinedCommunities;

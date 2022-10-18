import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IParamGetCommunities } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';

const getDiscoverCommunitiesSearch = (set, get) => async (params: IParamGetCommunities) => {
  try {
    const { ids, hasNextPage } = get();

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

    useCommunitiesStore.getState().actions.addCommunity(data);

    set(
      {
        ids: [...ids, ...newIds],
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

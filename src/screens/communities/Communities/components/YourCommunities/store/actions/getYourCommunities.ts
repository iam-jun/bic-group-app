import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import useAdvancedNotiSettingsStore from '~/screens/Notification/AdvancedSettings/store';

const getYourCommunities
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { ids, items, hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;
      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'getYourCommunitiesFetching',
      );

      const params = {
        managed: false,
        previewMembers: true,
        limit: appConfig.recordsPerPage,
        offset: isRefreshing ? 0 : ids.length,
      };
      const response = await groupApi.getJoinedCommunities(params);

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
        'getYourCommunitiesSuccess',
      );
      if (isRefreshing) {
        useAdvancedNotiSettingsStore.getState().actions.setSelectedCommunity(data[0]);
        useAdvancedNotiSettingsStore.getState().actions.setIsLoading(false);
      }
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ getYourCommunities error: ',
        e,
        '\x1b[0m',
      );
      set(
        {
          loading: false,
          refreshing: false,
        },
        'getYourCommunitiesFailed',
      );
      useAdvancedNotiSettingsStore.getState().actions.setIsLoading(false);
    }
  };

export default getYourCommunities;

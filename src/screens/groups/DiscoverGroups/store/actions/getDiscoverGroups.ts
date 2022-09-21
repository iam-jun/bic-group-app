import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IPayloadGetDiscoverGroups } from '~/interfaces/ICommunity';
import { mapItems } from '~/screens/groups/helper/mapper';
import IDiscoverGroupsState from '../Interface';

const getDiscoverGroups = (set, get) => async (
  payload: IPayloadGetDiscoverGroups,
) => {
  try {
    const { communityId, params, isRefreshing } = payload;
    const {
      ids, items, canLoadMore, doGetCommunityGroups,
    }: IDiscoverGroupsState = get();
    if (!isRefreshing && !canLoadMore) return;
    set((state: IDiscoverGroupsState) => {
      state.loading = isRefreshing ? true : ids.length === 0;
      state.noGroupInCommuntity = false;
    }, 'getDiscoverGroups');
    const response = await groupApi.getDiscoverGroups(communityId, {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : ids.length,
      ...params,
    });

    const responseData = response?.data || [];
    const newIds = responseData.map((item: any) => item.id);
    const newItems = mapItems(responseData);

    set((state: IDiscoverGroupsState) => {
      state.loading = false;
      state.canLoadMore = newIds.length === appConfig.recordsPerPage;
      state.ids = isRefreshing ? [...newIds] : [...ids, ...newIds];
      state.items = isRefreshing ? { ...newItems } : { ...items, ...newItems };
    }, 'getDiscoverGroupsSuccess');

    if (responseData.length === 0) {
      doGetCommunityGroups(communityId);
    }
  } catch (err) {
    console.error(
      'getDiscoverGroups error:', err,
    );
    set((state: IDiscoverGroupsState) => {
      state.loading = false;
    }, 'getDiscoverGroupsError');
  }
};

export default getDiscoverGroups;

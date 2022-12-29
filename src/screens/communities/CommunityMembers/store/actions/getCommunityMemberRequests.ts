import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import { IJoiningMember } from '~/interfaces/IGroup';
import showError from '~/store/helper/showError';
import groupApi from '~/api/GroupApi';
import { mapItems } from '~/screens/groups/helper/mapper';
import { IPayloadGetCommunityMemberRequests } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';

const getCommunityMemberRequests = (get) => async (payload: IPayloadGetCommunityMemberRequests) => {
  const { communityMemberRequests, actions }: ICommunityMemberState = get();
  const { ids, items, canLoadMore } = communityMemberRequests || {};
  const { groupId, isRefreshing, params } = payload || {};

  try {
    actions.setCommunityMemberRequests({
      loading: isRefreshing ? true : ids.length === 0,
    });

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await groupApi.getGroupMemberRequests(groupId, {
      offset: isRefreshing ? 0 : ids.length,
      limit: appConfig.recordsPerPage,
      key: memberRequestStatus.WAITING,
      ...params,
    });

    const requestIds = response.data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response.data);

    const newData = {
      total: response?.meta?.total,
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      ids: isRefreshing ? [...requestIds] : [...ids, ...requestIds],
      items: isRefreshing ? { ...requestItems } : { ...items, ...requestItems },
    };

    actions.setCommunityMemberRequests(newData);
  } catch (e) {
    showError(e);
    actions.setCommunityMemberRequests({
      loading: false,
    });
    console.error('\x1b[31m🐣️ action getCommunityMemberRequests error: ', e, '\x1b[0m');
  }
};

export default getCommunityMemberRequests;

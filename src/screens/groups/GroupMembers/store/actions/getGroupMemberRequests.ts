import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import { IJoiningMember, IPayloadGetGroupMemberRequests } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { mapItems } from '~/screens/groups/helper/mapper';
import { IGroupMemberState } from '../index';

const getGroupMemberRequests = (get) => async (payload: IPayloadGetGroupMemberRequests) => {
  const { groupMemberRequests, actions }: IGroupMemberState = get();
  const { ids, canLoadMore, items } = groupMemberRequests || {};
  const { groupId, isRefreshing, params } = payload;

  try {
    actions.setGroupMemberRequests({
      loading: isRefreshing ? true : ids.length === 0,
    });

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await groupApi.getGroupMemberRequests(
      groupId,
      {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const { data } = response;
    const requestIds = data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(data);

    actions.setGroupMemberRequests({
      total: response?.meta?.total,
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      ids: isRefreshing ? [...requestIds] : [...ids, ...requestIds],
      items: isRefreshing ? { ...requestItems } : { ...items, ...requestItems },
    });
  } catch (e) {
    showToastError(e);
    actions.setGroupMemberRequests({
      loading: false,
    });
    console.error('\x1b[31m🐣️ action getGroupMemberRequests error: ', e, '\x1b[0m');
  }
};

export default getGroupMemberRequests;

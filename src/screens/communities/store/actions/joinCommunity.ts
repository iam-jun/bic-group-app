import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useCommunitiesStore from '~/store/entities/communities';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import { ICommunity } from '~/interfaces/ICommunity';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const joinCommunity
  = (_set, _get) => async (communityId: string, _communityName: string) => {
    try {
      const response = await groupApi.joinCommunity(communityId);
      const joinStatus = response?.data?.joinStatus;
      const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;
      const userCount = useCommunitiesStore.getState().data?.[communityId]?.userCount || 0;

      // update button Join/Cancel/View status on Discover communities
      Store.store.dispatch(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus },
        }),
      );

      useCommunitiesStore.getState().actions.updateCommunity(
        communityId,
        {
          joinStatus,
          userCount: hasRequested ? userCount : userCount + 1,
        } as ICommunity,
      );

      showToastSuccess(response);
    } catch (error) {
      console.error('joinCommunity catch', error);
      showToastError(error);
    }
  };

export default joinCommunity;

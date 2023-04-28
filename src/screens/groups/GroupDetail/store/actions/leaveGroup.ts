import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import showToastError from '~/store/helper/showToastError';
import useYourGroupsStore from '~/screens/communities/Communities/components/YourGroups/store';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';
import useGroupDetailStore from '../index';
import showToastSuccess from '~/store/helper/showToastSuccess';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveGroup = () => async (groupId: string, privacy: GroupPrivacyType) => {
  try {
    const response = await groupApi.leaveGroup(groupId);

    // update button Join/Cancel/View status on Discover groups
    useDiscoverGroupsStore
      .getState().actions.setGroupStatus(groupId, GroupJoinStatus.VISITOR);

    if (privacy === GroupPrivacyType.SECRET) {
      navigationPopToTop();
    } else {
      useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
    }

    // refresh list in screen Your Groups & Managed
    useYourGroupsStore.getState().actions.getYourGroups(true);
    useManagedStore.getState().actions.getManaged(true);

    showToastSuccess(response);
  } catch (err) {
    console.error('leaveGroup:', err);
    showToastError(err);
  }
};

const navigationPopToTop = () => {
  rootNavigation.popToTop();
};

export default leaveGroup;

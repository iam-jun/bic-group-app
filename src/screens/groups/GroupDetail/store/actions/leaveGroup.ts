import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import Store from '~/storeRedux';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import showError from '~/store/helper/showError';
import useYourGroupsStore from '~/screens/communities/Communities/components/YourGroups/store';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveGroup = () => async (groupId: string, privacy: GroupPrivacyType) => {
  try {
    await groupApi.leaveGroup(groupId);

    // update button Join/Cancel/View status on Discover groups
    useDiscoverGroupsStore
      .getState()
      .doSetGroupStatus(groupId, GroupJoinStatus.VISITOR);

    if (privacy === GroupPrivacyType.SECRET) {
      navigationPopToTop();
    } else {
      Store.store.dispatch(groupsActions.getGroupDetail({ groupId }));
    }

    // refresh list in screen Your Groups & Managed
    useYourGroupsStore.getState().actions.getYourGroups(true);
    useManagedStore.getState().actions.getManaged(true);

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_leave_group:success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('leaveGroup:', err);
    showError(err);
  }
};

const navigationPopToTop = () => {
  rootNavigation.popToTop();
};

export default leaveGroup;

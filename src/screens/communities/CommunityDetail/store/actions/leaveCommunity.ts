import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { COMMUNITY_PRIVACY_TYPE, groupPrivacy } from '~/constants/privacyTypes';
import GROUP_JOIN_STATUS from '~/constants/groupJoinStatus';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveCommunity = (set, get) => async (
  communityId: string,
  privacy: COMMUNITY_PRIVACY_TYPE,
  dispatch: any,
) => {
  try {
    await groupApi.leaveCommunity(communityId);

    // update button Join/Cancel/View status on Discover community
    dispatch(groupsActions.editDiscoverCommunityItem({
      id: communityId,
      data: { joinStatus: GROUP_JOIN_STATUS.visitor },
    }));

    if (privacy === groupPrivacy.secret) {
      rootNavigation.popToTop();
    } else {
      dispatch(groupsActions.getCommunityDetail({ communityId }));
    }

    const toastMessage: IToastMessage = {
      content: 'communities:modal_confirm_leave_community:success_message',
      props: { type: 'success' },
    };
    dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('leaveCommunity error:', err);
    // TODO: dispatch error toast message
  }
};

export default leaveCommunity;

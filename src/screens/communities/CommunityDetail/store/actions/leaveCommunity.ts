import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { COMMUNITY_PRIVACY_TYPE, groupPrivacy } from '~/constants/privacyTypes';
import GROUP_JOIN_STATUS from '~/constants/groupJoinStatus';
import API_ERROR_CODE from '~/constants/apiErrorCode';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveCommunity = (_set, _get) => async (
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

    if (err.code === API_ERROR_CODE.GROUP.REVOKE_ACCOUNT_OWNER) {
      return dispatch(modalActions.showHideToastMessage({
        content: 'groups:error:owner_leave_community',
        props: { type: 'error' },
      }));
    };

    if (err.code === API_ERROR_CODE.GROUP.LAST_ADMIN_LEAVE) {
      return dispatch(modalActions.showHideToastMessage({
        content: 'groups:error:last_admin_inner_group_leave',
        props: { type: 'error' },
      }));
    }

    // TODO: Add dispatch error toast for other cases
  }
};

export default leaveCommunity;

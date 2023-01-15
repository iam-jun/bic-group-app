import i18next from 'i18next';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { ICommunityMemberState } from '../index';
import groupApi from '~/api/GroupApi';
import { IPayloadApproveAllCommunityMemberRequest } from '~/interfaces/ICommunity';

const approveAllCommunityMemberRequests = (get) => async (
  payload: IPayloadApproveAllCommunityMemberRequest,
) => {
  const { communityId, groupId, total } = payload || {};
  const { actions }: ICommunityMemberState = get();
  const { actions: communitiesActions } = useCommunitiesStore.getState();

  try {
    if (!groupId) return;

    actions.resetCommunityMemberRequests();
    // to show Empty screen component
    actions.setCommunityMemberRequests({ loading: false });

    await groupApi.approveAllGroupMemberRequests(groupId);

    // to update userCount
    communitiesActions.getCommunity(communityId);

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error('approveAllCommunityMemberRequest: ', e);
    showError(e);
  }
};

export default approveAllCommunityMemberRequests;

import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadDeclineAllCommunityMemberRequests } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';
import modalActions from '~/storeRedux/modal/actions';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';

const declineAllCommunityMemberRequests = (get) => async (
  payload: IPayloadDeclineAllCommunityMemberRequests,
) => {
  const { groupId, total } = payload || {};
  const { actions }: ICommunityMemberState = get();

  try {
    if (!groupId) return;

    await groupApi.declineAllGroupMemberRequests(groupId);
    actions.resetUndoCommunityMemberRequests();

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error('declineAllCommunityMemberRequests: ', e);
    showError(e);
  }
};

export default declineAllCommunityMemberRequests;

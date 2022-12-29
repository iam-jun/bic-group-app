import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadDeclineAllCommunityMemberRequests } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

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
    useModalStore.getState().actions.showToast(toastMessage);
  } catch (e) {
    console.error('declineAllCommunityMemberRequests: ', e);
    showToastError(e);
  }
};

export default declineAllCommunityMemberRequests;

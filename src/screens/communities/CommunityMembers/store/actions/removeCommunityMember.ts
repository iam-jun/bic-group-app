import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const removeCommunityMember = () => async (
  { communityId, userId }: {communityId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeCommunityMembers(communityId, [userId]);

    const newUpdatedData = removeMemberFromMemberList(userId, 'community');
    Store.store.dispatch(groupsActions.setCommunityMembers(newUpdatedData));

    // to update userCount
    // TODO recheck after merge
    // Store.store.dispatch(groupsActions.getCommunityDetail({ communityId }));

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeCommunityMember error:', error);

    // TODO: use showError helper once merged with BEIN-8192
    Store.store.dispatch(modalActions.showHideToastMessage({
      content: error?.meta?.errors?.[0]?.message
        || error?.meta?.message
        || 'common:text_error_message',
      props: { type: 'error' },
    }));
  }
};

export default removeCommunityMember;

export const removeMemberFromMemberList = (userId: string, type: 'community' | 'group') => {
  const { groups } = Store.store.getState();
  const membersData = groups[`${type}Members`] || {};

  let updatedData = {};
  let offset = 0;

  Object.keys(membersData).forEach(
    (role: string) => {
      const memberRoleData = membersData[role].data;
      if (memberRoleData
        && membersData[role].name
        && membersData[role].userCount) {
        const newData = memberRoleData.filter(
          (item: ICommunityMembers | IGroupMembers) => item.id !== userId,
        );

        // need to update this for loading more data
        offset += newData.length;

        updatedData = {
          ...updatedData,
          [role]: {
            ...membersData[role],
            data: newData,
            userCount: newData.length,
          },
        };
      }
    },
  );

  return {
    ...updatedData,
    offset,
  };
};

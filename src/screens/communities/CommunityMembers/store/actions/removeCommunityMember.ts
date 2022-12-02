import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const removeCommunityMember = () => async (
  { communityId, groupId, userId }: {communityId: string; groupId: string; userId: string},
) => {
  const userCount = useCommunitiesStore.getState().data?.[communityId]?.userCount || 0;

  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const newUpdatedData = removeMemberFromMemberList(userId, 'community');
    Store.store.dispatch(groupsActions.setCommunityMembers(newUpdatedData));

    // to update userCount
    useCommunitiesStore.getState().actions.updateCommunity(
      communityId,
      { userCount: userCount - 1 } as ICommunity,
    );

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeCommunityMember error:', error);

    showError(error);
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

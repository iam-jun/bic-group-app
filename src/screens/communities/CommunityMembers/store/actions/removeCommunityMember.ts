import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const removeCommunityMember = () => async (
  { communityId, userId }: {communityId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeCommunityMembers(communityId, [userId]);

    removeMemberFromMemberList(userId);

    // to update userCount
    Store.store.dispatch(groupsActions.getCommunityDetail({ communityId }));

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeCommunityMembers error:', error);

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

const removeMemberFromMemberList = (userId: string) => {
  const { groups } = Store.store.getState();
  const { communityMembers } = groups;

  let updatedData = {};
  let offset = 0;

  Object.keys(communityMembers).forEach(
    (role: string) => {
      const memberRoleData = communityMembers[role].data;
      if (memberRoleData) {
        const newData = memberRoleData.filter(
          (item: ICommunityMembers) => item.id !== userId,
        );

        // need to update this for loading more data
        offset += newData.length;

        updatedData = {
          ...updatedData,
          [role]: {
            ...communityMembers[role],
            data: newData,
            userCount: newData.length,
          },
        };
      }
    },
  );

  Store.store.dispatch(groupsActions.setCommunityMembers({
    ...updatedData,
    offset,
  }));
};

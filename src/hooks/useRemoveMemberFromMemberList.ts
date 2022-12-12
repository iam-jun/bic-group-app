import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import useGroupMemberStore, { IGroupMemberState } from '~/screens/groups/GroupMembers/store';
import storeRedux from '~/storeRedux';

const useRemoveMemberFromMemberList = (userId: string, type: 'community' | 'group') => {
  const { groups } = storeRedux.store.getState();

  // Waiting refactor communityMembers to make condition type ...
  const membersData
    = type === 'group'
      ? useGroupMemberStore((state: IGroupMemberState) => state.groupMembers)
      : groups[`${type}Members`] || {};

  let updatedData = {};
  let offset = 0;

  Object.keys(membersData).forEach((role: string) => {
    const memberRoleData = membersData[role].data;
    if (memberRoleData && membersData[role].name && membersData[role].userCount) {
      const newData = memberRoleData.filter((item: ICommunityMembers | IGroupMembers) => item.id !== userId);

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
  });

  return {
    ...updatedData,
    offset,
  };
};

export default useRemoveMemberFromMemberList;

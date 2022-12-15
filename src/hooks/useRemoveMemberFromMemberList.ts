import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';

const useRemoveMemberFromMemberList = (userId: string, membersData: object) => {
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
          userCount:
            newData.length !== memberRoleData.length ? membersData[role].userCount - 1 : membersData[role].userCount,
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

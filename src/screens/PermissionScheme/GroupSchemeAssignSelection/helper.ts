import { cloneDeep } from 'lodash';

export const handleSelectNewGroupScheme = (
  groupId: string,
  schemeId: string,
  data: {groupId: string; schemeId: string}[],
  groupAssignments: any,
) => {
  // filter to remove current selected
  const newData = data?.filter((item) => item?.groupId !== groupId);

  const findGroup = (groupAssign: any) => {
    if (groupAssign?.groupId === groupId) {
      group = groupAssign;
    } else {
      groupAssign?.children?.map?.(findGroup);
    }
  };

  // find group in assignments
  let group: any;
  findGroup(groupAssignments);

  // only push to array if scheme id is difference
  if (group?.schemeId !== schemeId) {
    newData.push({ groupId, schemeId });
  }

  return newData;
};

export const changeSchemeIdOfGroup = (
  groupId: string,
  schemeId: string,
  groupAssignments: any,
) => {
  const newAssignments = cloneDeep(groupAssignments);

  const updateSchemeId = (group: any) => {
    if (group?.groupId === groupId) {
      group.schemeId = schemeId;
    } else {
      group?.children?.map(updateSchemeId);
    }
  };
  updateSchemeId(newAssignments);

  return newAssignments;
};

export const getAudienceIdsFromSelecting = (selectingData) => {
  const { groups = {} } = selectingData || {};
  const groupIds = [];
  const userIds = [];
  Object.keys(groups).forEach((groupId) => {
    if (groups?.[groupId]) {
      groupIds.push(groupId);
    }
  });
  return { groupIds, userIds };
};

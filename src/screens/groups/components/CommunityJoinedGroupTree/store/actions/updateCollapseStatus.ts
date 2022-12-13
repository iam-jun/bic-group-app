import groupApi from '~/api/GroupApi';

const updateCollapseStatus = (_set, _get) => async (communityId, groupId, isCollapsed) => {
  try {
    await groupApi.putGroupStructureCollapseStatus(communityId, groupId, isCollapsed);
  } catch (error) {
    console.error('\x1b[35m🐣️ getJoinedGroupTree error ', error, '\x1b[0m');
  }
};

export default updateCollapseStatus;

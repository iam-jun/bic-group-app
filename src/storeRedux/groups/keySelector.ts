const groupsKeySelector = {
  groupDetail: {
    group: 'groups.groupDetail.group',
    joinStatus: 'groups.groupDetail.joinStatus',
  },
  yourGroupsSearchData: 'groups.yourGroupsSearch',
  yourGroupsTreeData: 'groups.yourGroupsTree',
  yourGroupsListData: 'groups.yourGroupsList',
  groupSearch: 'groups.groupSearch',
  refreshingGroupPosts: 'groups.refreshingGroupPosts',
  loadingGroupMember: 'groups.loadingGroupMember',
  groupMembers: 'groups.groupMembers',
  groupSearchMembers: 'groups.groupSearchMembers',
  selectedUsers: 'groups.selectedUsers',
  users: 'groups.users',
  posts: 'groups.posts',
  addSuccess: 'groups.addSuccess',
  userAddedCount: 'groups.userAddedCount',
  joinedGroups: 'groups.joinedGroups',
  loadingJoinedGroups: 'groups.loadingJoinedGroups',
  loadingGroupDetail: 'groups.loadingGroupDetail',
  loadingPage: 'groups.loadingPage',
  groupMemberRequests: 'groups.groupMemberRequests',
  loadingAvatar: 'groups.loadingAvatar',
  loadingCover: 'groups.loadingCover',
  joinedCommunities: 'groups.joinedCommunities.data',
  managedCommunities: 'groups.managedCommunities',
  discoverCommunitiesData: 'groups.discoverCommunities',
  loadingCommunities: 'groups.communities.loading',
  communityDetail: 'groups.communityDetail',
  isGettingInfoDetail: 'groups.isGettingInfoDetail',
  communityMembers: 'groups.communityMembers',
  communitySearchMembers: 'groups.communitySearchMembers',
  discoverGroups: 'groups.discoverGroups',
  communityMemberRequests: 'groups.communityMemberRequests',
  permission: {
    categories: 'groups.permissionScheme.categories',
    systemScheme: 'groups.permissionScheme.systemScheme',
    schemes: 'groups.permissionScheme.schemes',
    communityScheme: 'groups.permissionScheme.communityScheme',
    creatingScheme: {
      name: 'groups.permissionScheme.creatingScheme.data.name',
      description: 'groups.permissionScheme.creatingScheme.data.description',
      roles: 'groups.permissionScheme.creatingScheme.data.roles',
      memberRoleIndex: 'groups.permissionScheme.creatingScheme.memberRoleIndex',
      creating: 'groups.permissionScheme.creatingScheme.creating',
    },
    groupScheme: 'groups.permissionScheme.groupScheme.data',
    assignGroupScheme: {
      assignments: 'groups.permissionScheme.assignGroupScheme.assignments',
      assigning: 'groups.permissionScheme.assignGroupScheme.assigning',
    },
  },
  groupStructure: {
    communityTree: 'groups.groupStructure.communityTree',
    reorder: 'groups.groupStructure.reorder',
    move: 'groups.groupStructure.move',
  },
  communitySearch: 'groups.communitySearch',
  myPermissions: 'groups.myPermissions',
  permissionsByScopeAndId: (
    scope: 'communities' | 'groups', id: number,
  ) => `groups.myPermissions.data.${scope}.${id}`,
  joinedAllGroups: 'groups.joinedAllGroups',
};

export default groupsKeySelector;

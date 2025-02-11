import React, { useEffect } from 'react';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberList from '~/screens/groups/components/MemberList';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useCommunityMemberStore from '../store';
import useBlockingStore from '~/store/blocking';

interface CommunityMemberListProps {
  community: ICommunity;
  onPressMenu: (item: ICommunityMembers) => void;
}

const CommunityMemberList = ({ community, onPressMenu }: CommunityMemberListProps) => {
  const { groupId, id } = community;
  const actions = useCommunityMemberStore((state) => state.actions);
  const canLoadMore = useCommunityMemberStore((state) => state.communityMembers.canLoadMore);

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canManageMember = shouldHavePermission(
    groupId,
    [
      PermissionKey.REMOVE_MEMBER,
      PermissionKey.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const isAdminRole = shouldHavePermission(
    groupId,
    [
      PermissionKey.ROLE_COMMUNITY_OWNER,
      PermissionKey.ROLE_COMMUNITY_ADMIN,
      PermissionKey.ROLE_GROUP_ADMIN,
    ],
  );

  const {
    actions: { getListRelationship },
    reset: resetBlocking,
  } = useBlockingStore();

  useEffect(
    () => {
      getCommunityMembers();
      getListRelationship();
      return () => {
        actions.clearCommunityMembers();
        resetBlocking();
      };
    }, [groupId],
  );

  const getCommunityMembers = (isRefreshing = false) => {
    if (!groupId) return;
    actions.getCommunityMembers(groupId, isRefreshing);
  };

  const onLoadMore = () => {
    if (!canLoadMore) return;
    getCommunityMembers();
  };

  const onRefresh = () => {
    getCommunityMembers(true);
    getListRelationship(true);
  };

  return (
    <MemberList
      type="community"
      communityId={id}
      isAdminRole={isAdminRole}
      canManageMember={canManageMember}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default CommunityMemberList;

import React, { useEffect } from 'react';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberList from '~/screens/groups/components/MemberList';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useCommunityMemberStore from '../store';

interface CommunityMemberListProps {
  community: ICommunity;
  onPressMenu: (item: ICommunityMembers) => void;
}

const CommunityMemberList = ({ community, onPressMenu }: CommunityMemberListProps) => {
  const { groupId } = community;
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

  useEffect(
    () => {
      getCommunityMembers();

      return () => {
        actions.clearCommunityMembers();
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
  };

  return (
    <MemberList
      type="community"
      canManageMember={canManageMember}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default CommunityMemberList;

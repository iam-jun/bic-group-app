import React, { useEffect } from 'react';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupMemberStore, { IGroupMemberState } from '../store';
import useBlockingStore from '~/store/blocking';

interface GroupMemberListProps {
  groupId: string;
  onPressMenu: (item: IGroupMembers) => void;
}

const GroupMemberList = ({ groupId, onPressMenu }: GroupMemberListProps) => {
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

  const { canLoadMore } = useGroupMemberStore(
    (state: IGroupMemberState) => state.groupMembers,
  );
  const actions = useGroupMemberStore((state) => state.actions);

  const getMembers = (isRefreshing = false) => {
    if (!groupId) return;
    actions.getGroupMembers({ groupId, isRefreshing });
  };

  const {
    actions: { getListRelationship },
    reset: resetBlocking,
  } = useBlockingStore();

  useEffect(
    () => {
      getMembers();
      getListRelationship();
      return () => {
        actions.clearGroupMembers();
        resetBlocking();
      };
    }, [groupId],
  );

  const onLoadMore = () => {
    if (!canLoadMore) return;
    getMembers();
  };

  const onRefresh = () => {
    getMembers(true);
    getListRelationship(true);
  };

  return (
    <MemberList
      type="group"
      isAdminRole={isAdminRole}
      canManageMember={canManageMember}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default GroupMemberList;

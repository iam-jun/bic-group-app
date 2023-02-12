import React, { useEffect } from 'react';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupMemberStore, { IGroupMemberState } from '../store';

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
  const { canLoadMore } = useGroupMemberStore(
    (state: IGroupMemberState) => state.groupMembers,
  );
  const actions = useGroupMemberStore((state) => state.actions);

  const getMembers = (isRefreshing = false) => {
    if (!groupId) return;
    actions.getGroupMembers({ groupId, isRefreshing });
  };

  useEffect(
    () => {
      getMembers();

      return () => {
        actions.clearGroupMembers();
      };
    }, [groupId],
  );

  const onLoadMore = () => {
    if (!canLoadMore) return;
    getMembers();
  };

  const onRefresh = () => {
    getMembers(true);
  };

  return (
    <MemberList
      type="group"
      canManageMember={canManageMember}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default GroupMemberList;

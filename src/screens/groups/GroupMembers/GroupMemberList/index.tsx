import React, { useEffect } from 'react';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import { useMyPermissions } from '~/hooks/permissions';
import useGroupMemberStore, { IGroupMemberState } from '../store';

interface GroupMemberListProps {
  groupId: string;
  onPressMenu: (item: IGroupMembers) => void;
}

const GroupMemberList = ({ groupId, onPressMenu }: GroupMemberListProps) => {
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    groupId,
    [
      PERMISSION_KEY.REMOVE_MEMBER,
      PERMISSION_KEY.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const { canLoadMore } = useGroupMemberStore(
    (state: IGroupMemberState) => state.groupMembers,
  );
  const actions = useGroupMemberStore((state) => state.actions);

  const getMembers = (isRefreshing?: boolean) => {
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
    canLoadMore && getMembers();
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

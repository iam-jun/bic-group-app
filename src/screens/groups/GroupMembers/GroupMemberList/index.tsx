import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/storeRedux/groups/actions';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';

interface GroupMemberListProps {
  groupId: string;
  onPressMenu: (item: IGroupMembers) => void;
}

const GroupMemberList = ({ groupId, onPressMenu }: GroupMemberListProps) => {
  const dispatch = useDispatch();
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    groupId,
    [
      PERMISSION_KEY.REMOVE_MEMBER,
      PERMISSION_KEY.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const { canLoadMore } = useKeySelector(groupsKeySelector.groupMembers);

  const getMembers = (isRefreshing?: boolean) => {
    if (!groupId) return;
    dispatch(actions.getGroupMembers({ groupId, isRefreshing }));
  };

  useEffect(
    () => {
      getMembers();

      return () => {
        dispatch(actions.clearGroupMembers());
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

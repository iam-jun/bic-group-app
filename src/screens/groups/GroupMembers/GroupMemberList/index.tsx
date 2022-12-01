import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/storeRedux/groups/actions';
import { useMyPermissions } from '~/hooks/permissions';

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

  const getMembers = (isRefreshing?: boolean) => {
    if (groupId) {
      dispatch(actions.getGroupMembers({ groupId, isRefreshing }));
    }
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

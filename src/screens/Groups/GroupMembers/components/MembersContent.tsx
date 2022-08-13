import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/storeRedux/groups/actions';
import { useMyPermissions } from '~/hooks/permissions';

interface MembersContentProps {
  groupId: string;
  onPressMenu: (item: IGroupMembers) => void;
}

const MembersContent = ({ groupId, onPressMenu }: MembersContentProps) => {
  const dispatch = useDispatch();
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    'groups', groupId, [
      PERMISSION_KEY.GROUP.ADD_REMOVE_GROUP_MEMBER,
      PERMISSION_KEY.GROUP.ASSIGN_UNASSIGN_ROLE_IN_GROUP,
    ],
  );

  const getMembers = (isRefreshing?: boolean) => {
    if (groupId) {
      dispatch(actions.getGroupMembers({ groupId, isRefreshing }));
    }
  };

  useEffect(
    () => {
      dispatch(actions.clearGroupMembers());
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

export default MembersContent;

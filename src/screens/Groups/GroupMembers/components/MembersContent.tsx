import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/screens/Groups/redux/actions';
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
      PERMISSION_KEY.GROUP.ADD_REMOVE_MEMBERS,
      PERMISSION_KEY.GROUP.ASSIGN_UNASSIGN_ROLE,
    ],
  );

  const getGroupProfile = () => {
    // to update canManageMember when member role changes
    dispatch(actions.getGroupDetail(groupId));
  };

  const getMembers = (isRefreshing?: boolean) => {
    if (groupId) {
      dispatch(actions.getGroupMembers({ groupId, isRefreshing }));
    }
  };

  useEffect(
    () => {
      dispatch(actions.clearGroupMembers());
      getMembers();
      getGroupProfile();

      return () => {
        dispatch(actions.clearGroupMembers());
      };
    }, [groupId],
  );

  const onLoadMore = () => {
    getMembers();
  };

  const onRefresh = () => {
    getGroupProfile();
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

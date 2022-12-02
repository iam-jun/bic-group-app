import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberList from '~/screens/groups/components/MemberList';
import actions from '~/storeRedux/groups/actions';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';

interface CommunityMemberListProps {
  community: ICommunity;
  onPressMenu: (item: ICommunityMembers) => void;
}

const CommunityMemberList = ({ community, onPressMenu }: CommunityMemberListProps) => {
  const { groupId } = community;
  const dispatch = useDispatch();
  const { canLoadMore } = useKeySelector(groupsKeySelector.communityMembers);

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    groupId,
    [
      PERMISSION_KEY.REMOVE_MEMBER,
      PERMISSION_KEY.ASSIGN_UNASSIGN_ROLE,
    ],
  );

  useEffect(
    () => {
      getCommunityMembers();

      return () => {
        resetCommunityMembers();
      };
    }, [groupId],
  );

  const getCommunityMembers = (isRefreshing?: boolean) => {
    if (!groupId) return;
    dispatch(actions.getCommunityMembers({ groupId, isRefreshing }));
  };

  const resetCommunityMembers = () => {
    dispatch(actions.resetCommunityMembers());
  };

  const onLoadMore = () => {
    canLoadMore && getCommunityMembers();
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

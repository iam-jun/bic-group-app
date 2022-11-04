import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberList from '~/screens/groups/components/MemberList';
import actions from '~/storeRedux/groups/actions';
import { useMyPermissions } from '~/hooks/permissions';

interface CommunityMemberListProps {
  community: ICommunity;
  onPressMenu: (item: ICommunityMembers) => void;
}

const CommunityMemberList = ({ community, onPressMenu }: CommunityMemberListProps) => {
  const { id: communityId, groupId } = community;
  const dispatch = useDispatch();

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
      PERMISSION_KEY.COMMUNITY.ASSIGN_UNASSIGN_ROLE_IN_COMMUNITY,
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

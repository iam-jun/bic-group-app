import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ICommunityMembers } from '~/interfaces/ICommunity';
import MemberList from '../components/MemberList';
import actions from '~/screens/Groups/redux/actions';
import { useMyPermissions } from '~/hooks/permissions';

interface MembersContentProps {
  communityId: string;
  onPressMenu: (item: ICommunityMembers) => void;
}

const MembersContent = ({ communityId, onPressMenu }: MembersContentProps) => {
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
    }, [communityId],
  );

  const getCommunityMembers = (isRefreshing?: boolean) => {
    dispatch(actions.getCommunityMembers({ communityId, isRefreshing }));
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

export default MembersContent;

import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import MemberList from '../components/MemberList';
import actions from '~/screens/Groups/redux/actions';
import {hasPermission} from '~/utils/checkPermissionScheme';
import {PERMISSION_KEY} from '~/constants/permissionScheme';

interface MembersContentProps {
  communityId: number;
  onPressMenu: (item: ICommunityMembers) => void;
}

const MembersContent = ({communityId, onPressMenu}: MembersContentProps) => {
  const dispatch = useDispatch();
  const currentPermissions = useKeySelector(
    groupsKeySelector.currentCommunityPermissions(communityId),
  );
  const canManageMember = hasPermission(
    [
      PERMISSION_KEY.COMMUNITY.ADD_REMOVE_MEMBERS,
      PERMISSION_KEY.COMMUNITY.ASSIGN_UNASSIGN_ROLE,
    ],
    currentPermissions,
  );

  useEffect(() => {
    getCommunityDetail();
    getCommunityMembers();

    return () => {
      resetCommunityMembers();
    };
  }, [communityId]);

  const getCommunityMembers = (isRefreshing?: boolean) => {
    dispatch(actions.getCommunityMembers({communityId, isRefreshing}));
  };

  const resetCommunityMembers = () => {
    dispatch(actions.resetCommunityMembers());
  };

  const getCommunityDetail = () => {
    // to update can_manage_member when member role changes
    dispatch(actions.getCommunityDetail({communityId}));
  };

  const onLoadMore = () => {
    getCommunityMembers();
  };

  const onRefresh = () => {
    getCommunityDetail();
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

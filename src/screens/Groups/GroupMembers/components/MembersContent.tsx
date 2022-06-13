import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {IGroupMembers} from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/screens/Groups/redux/actions';

interface MembersContentProps {
  groupId: number;
  onPressMenu: (item: IGroupMembers) => void;
}

const MembersContent = ({groupId, onPressMenu}: MembersContentProps) => {
  const dispatch = useDispatch();
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );

  const getGroupProfile = () => {
    // to update can_manage_member when member role changes
    dispatch(actions.getGroupDetail(groupId));
  };

  const getMembers = (isRefreshing?: boolean) => {
    if (groupId) {
      dispatch(actions.getGroupMembers({groupId, isRefreshing}));
    }
  };

  useEffect(() => {
    dispatch(actions.clearGroupMembers());
    getMembers();
    getGroupProfile();

    return () => {
      dispatch(actions.clearGroupMembers());
    };
  }, [groupId]);

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
      canManageMember={can_manage_member}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default MembersContent;

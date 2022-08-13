import React from 'react';
import { useDispatch } from 'react-redux';

import { clearToastMessage } from '~/storeRedux/modal/actions';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import PendingUserItem from '~/screens/Groups/components/PendingUserItem';

const GroupMemberRequest = ({
  requestId,
}: {
  requestId: string;
}) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const groupMemberRequests = useKeySelector(groupsKeySelector.groupMemberRequests);
  const { items } = groupMemberRequests;

  const requestItem = items[requestId];
  const { groupId, user } = requestItem;
  const { fullname: fullName } = user;

  const navigateToGroupMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(
      groupStack.groupMembers, { groupId },
    );
  };

  const onPressApprove = () => {
    dispatch(groupsActions.approveSingleGroupMemberRequest({
      groupId,
      requestId,
      fullName,
      callback: navigateToGroupMembers,
    }));
  };

  const onPressDecline = () => {
    dispatch(groupsActions.declineSingleGroupMemberRequest({
      groupId,
      requestId,
      fullName,
    }));
  };

  return (
    <PendingUserItem
      requestItem={requestItem}
      onPressApprove={onPressApprove}
      onPressDecline={onPressDecline}
    />
  );
};

export default GroupMemberRequest;

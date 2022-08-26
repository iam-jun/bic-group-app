import React from 'react';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import PendingUserItem from '~/screens/groups/components/PendingUserItem';

const GroupPendingUserItemWrapper = ({
  requestId,
}: {
  requestId: string;
}) => {
  const dispatch = useDispatch();

  const groupMemberRequests = useKeySelector(groupsKeySelector.groupMemberRequests);
  const { items } = groupMemberRequests;

  const requestItem = items[requestId];
  const { groupId, user } = requestItem;
  const { fullname: fullName } = user;

  const onPressApprove = () => {
    dispatch(groupsActions.approveSingleGroupMemberRequest({
      groupId,
      requestId,
      fullName,
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

export default GroupPendingUserItemWrapper;

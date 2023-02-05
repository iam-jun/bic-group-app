import React from 'react';
import PendingUserItem from '~/screens/groups/components/PendingUserItem';
import useGroupMemberStore from '../../store';

const GroupPendingUserItemWrapper = ({
  requestId,
}: {
  requestId: string;
}) => {
  const groupMemberRequests = useGroupMemberStore((state) => state.groupMemberRequests);
  const { items } = groupMemberRequests;
  const actions = useGroupMemberStore((state) => state.actions);

  const requestItem = items[requestId];
  const { groupId, user } = requestItem;
  const { fullname: fullName } = user;

  const onPressApprove = () => {
    actions.approveSingleGroupMemberRequest({
      groupId,
      requestId,
      fullName,
    });
  };

  const onPressDecline = () => {
    actions.declineSingleGroupMemberRequest({
      groupId,
      requestId,
      fullName,
    });
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

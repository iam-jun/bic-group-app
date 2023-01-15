import React from 'react';

import PendingUserItem from '~/screens/groups/components/PendingUserItem';
import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';

const CommunityPendingUserItemWrapper = ({
  requestId,
  organizationId: communityId,
}: {
  requestId: string;
  organizationId: string;
}) => {
  const communityMemberRequests = useCommunityMemberStore((state) => state.communityMemberRequests);
  const communityMemberActions = useCommunityMemberStore((state) => state.actions);
  const { items } = communityMemberRequests;

  const requestItem = items[requestId];
  const { user, groupId } = requestItem;
  const { fullname: fullName } = user;

  const onPressApprove = () => {
    communityMemberActions.approveSingleCommunityMemberRequest({
      communityId,
      groupId,
      requestId,
      fullName,
    });
  };

  const onPressDecline = () => {
    communityMemberActions.declineSingleCommunityMemberRequest({
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

export default CommunityPendingUserItemWrapper;

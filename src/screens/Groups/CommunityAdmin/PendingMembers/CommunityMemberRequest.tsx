import React from 'react';
import { useDispatch } from 'react-redux';

import PendingUserItem from '../../components/PendingUserItem';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupsActions from '../../redux/actions';

const CommunityMemberRequest = ({
  requestId,
  organizationId: communityId,
}: {
  requestId: string;
  organizationId: string;
}) => {
  const dispatch = useDispatch();

  const communityMemberRequests = useKeySelector(
    groupsKeySelector.communityMemberRequests,
  );
  const { items } = communityMemberRequests;

  const requestItem = items[requestId];
  const { user } = requestItem;
  const { fullname: fullName } = user;

  const onPressApprove = () => {
    dispatch(
      groupsActions.approveSingleCommunityMemberRequest({
        communityId,
        requestId,
        fullName,
      }),
    );
  };

  const onPressDecline = () => {
    dispatch(
      groupsActions.declineSingleCommunityMemberRequest({
        communityId,
        requestId,
        fullName,
      }),
    );
  };

  return (
    <PendingUserItem
      requestItem={requestItem}
      onPressApprove={onPressApprove}
      onPressDecline={onPressDecline}
    />
  );
};

export default CommunityMemberRequest;

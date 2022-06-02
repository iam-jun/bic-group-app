import {View, Text} from 'react-native';
import React from 'react';

import PendingUserItem from '../../components/PendingUserItem';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';

const CommunityMemberRequest = ({requestId}: {requestId: number}) => {
  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const communityMemberRequests = useKeySelector(
    groupsKeySelector.communityMemberRequests,
  );
  const {items} = communityMemberRequests;

  const requestItem = items[requestId];
  const {user} = requestItem;
  const {fullname: fullName} = user;

  const onPressApprove = () => {
    // TODO: ADD FUNCTIONALITY
  };

  const onPressDecline = () => {
    // TODO: ADD FUNCTIONALITY
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

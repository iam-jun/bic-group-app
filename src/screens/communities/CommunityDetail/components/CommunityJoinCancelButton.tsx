import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import groupJoinStatus from '~/constants/groupJoinStatus';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import JoinCancelButton from '../../../groups/components/JoinCancelButton';

interface CommunityJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
}

const CommunityJoinCancelButton = ({ style }: CommunityJoinCancelButtonProps) => {
  const dispatch = useDispatch();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    privacy,
    joinStatus,
    id: communityId,
    name: communityName,
  } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;

  if (isMember) return null;

  const onPressJoin = () => {
    dispatch(groupsActions.joinCommunity({ communityId, communityName }));
  };

  const onPressCancelRequest = () => {
    dispatch(groupsActions.cancelJoinCommunity({ communityId, communityName }));
  };

  return (
    <JoinCancelButton
      type="community"
      style={style}
      joinStatus={joinStatus}
      privacy={privacy}
      onPressJoin={onPressJoin}
      onPressCancelRequest={onPressCancelRequest}
    />
  );
};

export default CommunityJoinCancelButton;

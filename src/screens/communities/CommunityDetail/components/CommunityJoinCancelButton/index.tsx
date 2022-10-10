import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityController from '~/screens/communities/store';
import JoinCancelButton from '../../../../groups/components/JoinCancelButton';

interface CommunityJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
  isMember: boolean;
  community: ICommunity;
}

const CommunityJoinCancelButton = ({ style, isMember, community }: CommunityJoinCancelButtonProps) => {
  const {
    privacy,
    joinStatus,
    id,
    name,
  } = community;
  const actions = useCommunityController((state) => state.actions);

  if (isMember) return null;

  const onPressJoin = () => {
    actions.joinCommunity(id, name);
  };

  const onPressCancelRequest = () => {
    actions.cancelJoinCommunity(id, name);
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

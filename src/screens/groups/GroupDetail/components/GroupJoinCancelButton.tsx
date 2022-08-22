import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import groupsActions from '../../../../storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import JoinCancelButton from '../../components/JoinCancelButton';

interface GroupJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
}

const GroupJoinCancelButton = ({ style }: GroupJoinCancelButtonProps) => {
  const dispatch = useDispatch();
  const infoDetail = useKeySelector(groupsKeySelector.groupDetail.group);
  const {
    privacy,
    id: groupId,
    name: groupName,
  } = infoDetail;
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;

  if (isMember) return null;

  const onPressJoin = () => {
    dispatch(groupsActions.joinNewGroup({ groupId, groupName }));
  };

  const onPressCancelRequest = () => {
    dispatch(groupsActions.cancelJoinGroup({ groupId, groupName }));
  };

  return (
    <JoinCancelButton
      type="group"
      style={style}
      joinStatus={joinStatus}
      privacy={privacy}
      onPressJoin={onPressJoin}
      onPressCancelRequest={onPressCancelRequest}
    />
  );
};

export default GroupJoinCancelButton;

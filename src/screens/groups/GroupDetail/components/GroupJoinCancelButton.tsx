import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import groupsActions from '../../../../storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import JoinCancelButton from '../../components/JoinCancelButton';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';

interface GroupJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
}

const GroupJoinCancelButton = ({ style }: GroupJoinCancelButtonProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const infoDetail = useKeySelector(groupsKeySelector.groupDetail.group);
  const {
    privacy,
    id: groupId,
    name: groupName,
  } = infoDetail;
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const { joinStatus: joinStatusCommunity } = useKeySelector(groupsKeySelector.communityDetail);
  const isMember = joinStatus === groupJoinStatus.member;
  const isMemberOfCommunity = joinStatusCommunity === groupJoinStatus.member;

  if (isMember) return null;

  const onPressJoin = () => {
    if (!isMemberOfCommunity) {
      dispatch(modalActions.showAlert({
        title: t('error:alert_title'),
        content: t('communities:text_must_be_member_first'),
        confirmLabel: t('common:text_ok'),
      }));
      return;
    }

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

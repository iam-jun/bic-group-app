import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import GroupJoinStatus from '~/constants/GroupJoinStatus';
import JoinCancelButton from '../../components/JoinCancelButton';
import { useBaseHook } from '~/hooks';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import useDiscoverGroupsStore from '../../DiscoverGroups/store';
import IDiscoverGroupsState from '../../DiscoverGroups/store/Interface';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useModalStore from '~/store/modal';

interface GroupJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
}

const GroupJoinCancelButton = ({ style }: GroupJoinCancelButtonProps) => {
  const { t } = useBaseHook();
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: infoDetail, joinStatus } = groups[currentGroupId] || {};
  const {
    privacy,
    id: groupId,
  } = infoDetail || {};
  const communityId = useCommunitiesStore((state: ICommunitiesState) => state.currentCommunityId);
  const community = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const joinStatusCommunity = community?.joinStatus;
  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const isMemberOfCommunity = joinStatusCommunity === GroupJoinStatus.MEMBER;

  const joinNewGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doJoinNewGroup);
  const cancelJoinGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doCancelJoinGroup);
  const { showAlert } = useModalStore((state) => state.actions);

  if (isMember) return null;

  const onPressJoin = () => {
    if (!isMemberOfCommunity) {
      showAlert({
        title: t('error:alert_title'),
        content: t('communities:text_must_be_member_first'),
        confirmLabel: t('common:text_ok'),
      });
      return;
    }

    joinNewGroup(groupId);
  };

  const onPressCancelRequest = () => {
    cancelJoinGroup(groupId);
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

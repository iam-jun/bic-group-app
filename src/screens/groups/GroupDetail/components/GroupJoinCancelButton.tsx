import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import GroupJoinStatus from '~/constants/GroupJoinStatus';
import JoinCancelButton from '../../components/JoinCancelButton';
import { useBaseHook } from '~/hooks';
import useDiscoverGroupsStore from '../../DiscoverGroups/store';
import IDiscoverGroupsState from '../../DiscoverGroups/store/Interface';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useModalStore from '~/store/modal';
import { ICommunity } from '~/interfaces/ICommunity';
import useTermStore from '~/components/TermsModal/store';

interface GroupJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
  community: ICommunity;
}

const GroupJoinCancelButton = ({ style, community }: GroupJoinCancelButtonProps) => {
  const { t } = useBaseHook();
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: infoDetail, joinStatus } = groups[currentGroupId] || {};
  const {
    privacy,
    id: groupId,
    settings,
  } = infoDetail || {};
  const joinStatusCommunity = community?.joinStatus;
  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const isMemberOfCommunity = joinStatusCommunity === GroupJoinStatus.MEMBER;

  const actions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);
  const { showAlert } = useModalStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

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
    if (!!settings.isActiveGroupTerms) {
      const payload = {
        groupId, rootGroupId: groupId, name: '', type: 'group', isActive: true,
      } as any;
      termsActions.setTermInfo(payload);
      return;
    }

    actions.joinNewGroup(groupId);
  };

  const onPressCancelRequest = () => {
    actions.cancelJoinGroup(groupId);
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

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import GroupJoinStatus from '~/constants/GroupJoinStatus';
import JoinCancelButton from '../../components/JoinCancelButton';
import useDiscoverGroupsStore from '../../DiscoverGroups/store';
import IDiscoverGroupsState from '../../DiscoverGroups/store/Interface';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useModalStore from '~/store/modal';
import useTermStore, { TermsInfo } from '~/components/TermsModal/store';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '~/components/MemberQuestionsModal/store';
import PreviewJoinableGroup from '~/components/PreviewJoinableGroup';
import { ITypeGroup } from '~/interfaces/common';
import { getPreviewJoinableGroup } from '~/components/PreviewJoinableGroup/store/helper';

interface GroupJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
}

const GroupJoinCancelButton = ({ style }: GroupJoinCancelButtonProps) => {
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: infoDetail, joinStatus } = groups[currentGroupId] || {};
  const {
    privacy,
    id: groupId,
    affectedSettings,
    name,
    icon,
    userCount,
  } = infoDetail || {};
  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const actions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);
  const { showModal } = useModalStore((state) => state.actions);
  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

  if (isMember || joinStatus == GroupJoinStatus.BE_INVITED) return null;

  const onPressJoin = async () => {
    try {
      const isShowModalPreviewJoinableGroup = await getPreviewJoinableGroup(groupId);
      if (isShowModalPreviewJoinableGroup) {
        showModal({
          isOpen: true,
          ContentComponent: <PreviewJoinableGroup group={infoDetail} />,
        });
        return;
      }

      if (affectedSettings?.isActiveMembershipQuestions) {
        const payload: MembershipQuestionsInfo = {
          groupId,
          name,
          icon,
          privacy,
          userCount,
          rootGroupId: groupId,
          type: ITypeGroup.GROUP,
          isActive: true,
          isActiveGroupTerms: affectedSettings?.isActiveGroupTerms,
        };
        membershipQuestionActions.setMembershipQuestionsInfo(payload);
        return;
      }

      if (affectedSettings?.isActiveGroupTerms) {
        const payload = {
          groupId,
          rootGroupId: groupId,
          name,
          icon,
          privacy,
          userCount,
          type: ITypeGroup.GROUP,
          isActive: true,
        } as TermsInfo;
        termsActions.setTermInfo(payload);
        return;
      }

      actions.joinNewGroup(groupId);
    } catch (error) {
      return null;
    }
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

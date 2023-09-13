import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityController from '~/screens/communities/store';
import JoinCancelButton from '../../../../groups/components/JoinCancelButton';
import useTermStore, { TermsInfo } from '~/components/TermsModal/store';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '~/components/MemberQuestionsModal/store';
import { ITypeGroup } from '~/interfaces/common';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

interface CommunityJoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
  isMember: boolean;
  community: ICommunity;
}

const CommunityJoinCancelButton = ({
  style, isMember, community,
}: CommunityJoinCancelButtonProps) => {
  const {
    privacy,
    joinStatus,
    id,
    groupId,
    name,
    icon,
    userCount,
    affectedSettings,
  } = community;
  const actions = useCommunityController((state) => state.actions);
  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

  if (isMember || joinStatus === GroupJoinStatus.BE_INVITED) return null;

  const onPressJoin = () => {
    if (affectedSettings?.isActiveMembershipQuestions) {
      const payload: MembershipQuestionsInfo = {
        groupId: id,
        rootGroupId: groupId,
        name,
        icon,
        privacy,
        userCount,
        type: ITypeGroup.COMMUNITY,
        isActive: true,
        isActiveGroupTerms: affectedSettings?.isActiveGroupTerms,
      };
      membershipQuestionActions.setMembershipQuestionsInfo(payload);
      return;
    }

    if (affectedSettings?.isActiveGroupTerms) {
      const payload = {
        groupId: id,
        rootGroupId: groupId,
        name,
        icon,
        privacy,
        userCount,
        type: ITypeGroup.COMMUNITY,
        isActive: true,
      } as TermsInfo;
      termsActions.setTermInfo(payload);
      return;
    }
    actions.joinCommunity({ communityId: id, communityName: name, rootGroupId: groupId });
  };

  const onPressCancelRequest = () => {
    actions.cancelJoinCommunity({ communityId: id, rootGroupId: groupId });
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

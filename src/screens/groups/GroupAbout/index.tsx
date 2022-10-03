import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';

const GroupAbout = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const { name, id } = groupInfo;
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId: id, isMember });
  };

  return (
    <ScreenWrapper isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <AboutContent profileInfo={groupInfo} onPressMember={onPressTotalMember} />
    </ScreenWrapper>
  );
};

export default GroupAbout;

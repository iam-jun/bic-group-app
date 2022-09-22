import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import AboutContent from '../CommunityDetail/components/AboutContent';
import groupJoinStatus from '~/constants/groupJoinStatus';

const CommunityAbout = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { name, id, joinStatus } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId: id, isMember });
  };

  return (
    <ScreenWrapper isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <AboutContent profileInfo={infoDetail} onPressMember={onPressTotalMember} />
    </ScreenWrapper>
  );
};

export default CommunityAbout;

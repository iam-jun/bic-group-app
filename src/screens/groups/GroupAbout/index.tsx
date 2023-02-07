import React from 'react';
import { ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';

const GroupAbout = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: groupInfo, joinStatus } = groups[currentGroupId] || {};
  const { name, id } = groupInfo || {};
  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId: id, isMember });
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.gray5} isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <ScrollView>
        <AboutContent profileInfo={groupInfo} onPressMember={onPressTotalMember} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default GroupAbout;

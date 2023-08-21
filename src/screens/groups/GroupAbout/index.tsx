import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useTermStore from '~/components/TermsModal/store';
import useGroupDetailStore from '../GroupDetail/store';
import { ITypeGroup } from '~/interfaces/common';

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

  const [isRefresh, setIsRefresh] = useState(false);

  const getTermsData = useTermStore((state) => state.actions.getTermsData);
  const getGroupDetail = useGroupDetailStore((state) => state.actions.getGroupDetail);

  const getData = async () => {
    await Promise.all([getTermsData(id), getGroupDetail({ groupId: id })]);
  };

  const onRefresh = async () => {
    setIsRefresh(true);
    await getData();
    setIsRefresh(false);
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.gray5} isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} tintColor={theme.colors.gray40} />}
      >
        <AboutContent
          typeGroup={ITypeGroup.GROUP}
          profileInfo={groupInfo}
          groupId={id}
          onPressMember={onPressTotalMember}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default GroupAbout;

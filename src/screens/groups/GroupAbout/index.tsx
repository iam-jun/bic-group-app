import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useTermStore from '~/components/TermsModal/store';
import useGroupDetailStore from '../GroupDetail/store';
import { ITypeGroup } from '~/interfaces/common';

interface GroupAboutProps {
  route: {
    params: {
      groupId: string;
    },
  }
}

const GroupAbout = (props: GroupAboutProps) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();

  const { params } = props?.route || {};
  const { groupId } = params || {};
  const { groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: groupInfo, joinStatus } = groups[groupId] || {};
  const { name, id, communityId } = groupInfo || {};
  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId: id, isMember, communityId });
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

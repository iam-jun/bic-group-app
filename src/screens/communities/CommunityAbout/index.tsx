import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import AboutContent from '../CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useTermStore from '~/components/TermsModal/store';
import { ITypeGroup } from '~/interfaces/common';

const CommunityAbout = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const data = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const { groupId } = data || {};
  const isMember = data?.joinStatus === GroupJoinStatus.MEMBER;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId, isMember });
  };

  const [isRefresh, setIsRefresh] = useState(false);

  const {
    actions: { getTermsData },
  } = useTermStore((state) => state);
  const {
    actions: { getCommunity },
  } = useCommunitiesStore((state) => state);

  const getData = async () => {
    await Promise.all([getTermsData(groupId), getCommunity(communityId)]);
  };

  const onRefresh = async () => {
    setIsRefresh(true);
    await getData();
    setIsRefresh(false);
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.gray5} isFullView>
      <Header title={`${t('settings:title_about')} ${data?.name}`} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} tintColor={theme.colors.gray40} />}
      >
        <AboutContent
          typeGroup={ITypeGroup.COMMUNITY}
          profileInfo={data as any}
          groupId={data?.groupId}
          communityId={communityId}
          onPressMember={onPressTotalMember}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default CommunityAbout;

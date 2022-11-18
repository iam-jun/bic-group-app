import React from 'react';
import { ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import AboutContent from '../CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

const CommunityAbout = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const data = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const isMember = data?.joinStatus === GroupJoinStatus.MEMBER;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId, isMember });
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.gray5} isFullView>
      <Header title={`${t('settings:title_about')} ${data?.name}`} />
      <ScrollView>
        <AboutContent profileInfo={data as any} onPressMember={onPressTotalMember} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default CommunityAbout;

import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import useCommunitiesStore from '~/store/comunities';
import ICommunitiesState from '~/store/comunities/Interface';
import AboutContent from '../CommunityDetail/components/AboutContent';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

const CommunityAbout = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const data = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const isMember = data?.joinStatus === GroupJoinStatus.MEMBER;

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId, isMember });
  };

  return (
    <ScreenWrapper isFullView>
      <Header title={`${t('settings:title_about')} ${data?.name}`} />
      <AboutContent profileInfo={data as any} onPressMember={onPressTotalMember} />
    </ScreenWrapper>
  );
};

export default CommunityAbout;

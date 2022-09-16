import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import AboutContent from '../CommunityDetail/components/AboutContent';

const CommunityAbout = () => {
  const { t } = useBaseHook();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    name,
  } = infoDetail;

  return (
    <ScreenWrapper isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <AboutContent />
    </ScreenWrapper>
  );
};

export default CommunityAbout;

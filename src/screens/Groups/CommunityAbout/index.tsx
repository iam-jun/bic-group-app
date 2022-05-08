import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import AboutContent from '../CommunityDetail/components/AboutContent';

const CommunityAbout = () => {
  return (
    <ScreenWrapper isFullView>
      <Header titleTextProps={{useI18n: true}} title={'settings:title_about'} />
      <AboutContent />
    </ScreenWrapper>
  );
};

export default CommunityAbout;

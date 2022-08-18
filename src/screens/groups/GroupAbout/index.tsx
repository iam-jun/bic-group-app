import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import GroupAboutContent from '../components/GroupAboutContent';

const GroupAbout = () => (
  <ScreenWrapper isFullView>
    <Header titleTextProps={{ useI18n: true }} title="settings:title_about" />
    <GroupAboutContent />
  </ScreenWrapper>
);

export default GroupAbout;

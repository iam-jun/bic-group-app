import React from 'react';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import GroupAboutContent from '../components/GroupAboutContent';

const GroupAbout = () => {
  //todo handle get data if group data not loaded
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group);

  return (
    <ScreenWrapper isFullView>
      <Header titleTextProps={{useI18n: true}} title={'settings:title_about'} />
      <GroupAboutContent />
    </ScreenWrapper>
  );
};

export default GroupAbout;

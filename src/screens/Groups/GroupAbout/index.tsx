import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useKeySelector} from '~/hooks/selector';
import GroupAboutContent from '../components/GroupAboutContent';
import groupsKeySelector from '../redux/keySelector';

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

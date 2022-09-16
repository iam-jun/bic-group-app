import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import GroupAboutContent from '../components/GroupAboutContent';

const GroupAbout = () => {
  const { t } = useBaseHook();
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {
    name,
  } = groupInfo;

  return (
    <ScreenWrapper isFullView>
      <Header title={`${t('settings:title_about')} ${name}`} />
      <GroupAboutContent />
    </ScreenWrapper>
  );
};

export default GroupAbout;

import React from 'react';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

const DiscoverGroups = () => {
  return (
    <ScreenWrapper isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'communities:title_discover_groups'}
      />
    </ScreenWrapper>
  );
};

export default DiscoverGroups;

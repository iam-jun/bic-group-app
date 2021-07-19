import React from 'react';
import {Text} from '~/components';
import ScreenWrapper from '~/components/ScreenWrapper';

const LeftPanel = () => {
  return (
    <ScreenWrapper testID="VipScreen" disabledDarkMode isFullView>
      <Text.H1>Home left panel</Text.H1>
    </ScreenWrapper>
  );
};

export default LeftPanel;

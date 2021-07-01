import React from 'react';
import {Text} from '~/components';
import ScreenWrapper from '~/components/ScreenWrapper';

const Vip = () => {
  return (
    <ScreenWrapper testID="VipScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        VipScreen ~~~~~
      </Text>
    </ScreenWrapper>
  );
};

export default Vip;

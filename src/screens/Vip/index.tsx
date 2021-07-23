import React from 'react';
import {Text} from '~/components';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

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

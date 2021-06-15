import React from 'react';
import {Text} from '~/theme/components';
import ThemeView from '~/theme/components/ThemeView';

const Vip = () => {
  return (
    <ThemeView testID="VipScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        VipScreen ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Vip;

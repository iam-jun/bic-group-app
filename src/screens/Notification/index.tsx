import React from 'react';
import {Text} from '~/theme/components';
import ThemeView from '~/theme/components/ThemeView';

const Notfitication = () => {
  return (
    <ThemeView testID="NotfiticationScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        NotfiticationScreen ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Notfitication;

import React from 'react';
import {Text} from '~/theme/components';
import ThemeView from '~/theme/components/ThemeView';

const Groups = () => {
  return (
    <ThemeView testID="GroupScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        GroupScreen ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Groups;

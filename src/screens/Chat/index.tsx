import React from 'react';
import {Text} from '~/theme/components';
import ThemeView from '~/theme/components/ThemeView';

const Chat = () => {
  return (
    <ThemeView testID="NotfiticationScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        Chat Screen ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Chat;

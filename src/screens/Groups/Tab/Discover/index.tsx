import React from 'react';
import {Text} from '~/theme/components';
import {useDispatch} from 'react-redux';
import {ThemeView} from '~/theme/components';

const DiscoverGroupScreen = props => {
  const dispatch = useDispatch();

  return (
    <ThemeView testID="GroupScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        ~~~ GroupScreen Discover ~~~
      </Text>
    </ThemeView>
  );
};

export default DiscoverGroupScreen;

import React from 'react';
import {Text} from '~/theme/components';
import {useDispatch} from 'react-redux';
import {ThemeView} from '~/theme/components';

const DiscoveryGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ThemeView testID="DiscoveryScreen" isFullView>
      <Text h1 bold>
        ~~~ Discovery group screen ~~~
      </Text>
    </ThemeView>
  );
};

export default DiscoveryGroupScreen;

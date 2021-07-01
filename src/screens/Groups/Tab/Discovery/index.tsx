import React from 'react';
import {Text} from '~/components';
import {useDispatch} from 'react-redux';
import {ScreenWrapper} from '~/components';

const DiscoveryGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ScreenWrapper testID="DiscoveryScreen" isFullView>
      <Text h1 bold>
        ~~~ Discovery group screen ~~~
      </Text>
    </ScreenWrapper>
  );
};

export default DiscoveryGroupScreen;

import React from 'react';
import {Text} from '~/components';
import {useDispatch} from 'react-redux';
import {ScreenWrapper} from '~/components';

const MyGroupsScreen = () => {
  const dispatch = useDispatch();

  return (
    <ScreenWrapper testID="MyGroupsScreen" isFullView>
      <Text h1 bold>
        ~~~ My Groups screen ~~~
      </Text>
    </ScreenWrapper>
  );
};

export default MyGroupsScreen;

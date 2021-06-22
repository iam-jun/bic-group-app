import React from 'react';
import {Text} from '~/theme/components';
import {useDispatch} from 'react-redux';
import {ThemeView} from '~/theme/components';

const MyGroupsScreen = () => {
  const dispatch = useDispatch();

  return (
    <ThemeView testID="MyGroupsScreen" isFullView>
      <Text h1 bold>
        ~~~ My Groups screen ~~~
      </Text>
    </ThemeView>
  );
};

export default MyGroupsScreen;

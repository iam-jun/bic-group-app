import React from 'react';
import {Text} from '~/components';
import ScreenWrapper from '~/components/ScreenWrapper';

const Search = () => {
  return (
    <ScreenWrapper testID="SearchScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        SearchScreen ~~~~~
      </Text>
    </ScreenWrapper>
  );
};

export default Search;

import React from 'react';
import {Text} from '~/theme/components';
import ThemeView from '~/theme/components/ThemeView';

const Search = () => {
  return (
    <ThemeView testID="SearchScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        SearchScreen ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Search;

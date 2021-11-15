import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import NewsfeedSearchSuggestion from '~/screens/Home/Newsfeed/NewsfeedSearch/NewsfeedSearchSuggestion';
import NewsfeedSearchResult from '~/screens/Home/Newsfeed/NewsfeedSearch/NewsfeedSearchResult';

const NewsfeedSearch = () => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const isShow = useKeySelector(homeKeySelector.newsfeedSearch.isShow);
  const isSuggestion = useKeySelector(
    homeKeySelector.newsfeedSearch.isSuggestion,
  );

  if (!isShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isSuggestion ? <NewsfeedSearchSuggestion /> : <NewsfeedSearchResult />}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
    },
  });
};

export default NewsfeedSearch;

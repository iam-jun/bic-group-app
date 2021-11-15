import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';

const NewsfeedSearch = () => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const isShow = useKeySelector(homeKeySelector.newsfeedSearch.isShow);
  const isSuggestion = useKeySelector(
    homeKeySelector.newsfeedSearch.isSuggestion,
  );

  const searchText = useKeySelector(homeKeySelector.newsfeedSearch.searchText);

  if (!isShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>{`See results for "${searchText}"`}</Text>
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

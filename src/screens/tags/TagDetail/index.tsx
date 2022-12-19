import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';

const TagDetail: React.FC<any> = ({ route }) => {
  const { params } = route || {};
  const { tagData } = params || {};
  const { name: tagName } = tagData || {};

  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.wrapper}>
      <Header removeBorderAndShadow title={tagName} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    listContainer: {
      flex: 1,
    },
  });
};

export default TagDetail;

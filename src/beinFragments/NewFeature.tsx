import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';

const NewFeature = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);

  return (
    <View style={styles.root}>
      <Text>New feature</Text>
    </View>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    root: {
      height: 415,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
  });
};

export default NewFeature;

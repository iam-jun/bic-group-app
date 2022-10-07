import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { padding } from '~/theme/spacing';
import Text from '~/beinComponents/Text';

interface Props {
    name: string,
    style?: StyleProp<ViewStyle>
}

const HashTag: FC<Props> = ({ name, style }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text.BodyS style={styles.tag}>{`#${name}`}</Text.BodyS>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.neutral40,
      borderRadius: 2,
      paddingVertical: 2,
      paddingHorizontal: padding.small,
    },
    tag: {
      color: colors.neutral60,
    },
  });
};

export default HashTag;

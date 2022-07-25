import React, { FC } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';

export interface CreatePostHeaderPlaceholderProps {
  style?: StyleProp<ViewStyle>;
}

const HeaderCreatePostPlaceholder: FC<CreatePostHeaderPlaceholderProps> = ({
  style,
}: CreatePostHeaderPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <Placeholder
      Animation={ShineOverlay}
      Left={(props) => <PlaceholderMedia style={[props.style, styles.left]} />}
      style={[styles.container, style]}
    >
      <PlaceholderLine style={styles.content} />
    </Placeholder>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.white,
    },
    left: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      borderRadius: 50,
      backgroundColor: colors.neutral5,
    },
    content: {
      width: '100%',
      height: 40,
      marginBottom: 0,
      marginTop: 0,
      borderRadius: 100,
    },
  });
};

export default HeaderCreatePostPlaceholder;

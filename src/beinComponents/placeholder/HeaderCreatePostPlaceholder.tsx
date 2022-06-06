import React, {FC} from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';

import {ITheme} from '~/theme/interfaces';

export interface CreatePostHeaderPlaceholderProps {
  style?: StyleProp<ViewStyle>;
}

const HeaderCreatePostPlaceholder: FC<CreatePostHeaderPlaceholderProps> = ({
  style,
}: CreatePostHeaderPlaceholderProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <Placeholder
      Animation={ShineOverlay}
      Left={props => <PlaceholderMedia style={[props.style, styles.left]} />}
      style={[styles.container, style]}>
      <PlaceholderLine style={styles.content} />
    </Placeholder>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
    },
    left: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      borderRadius: 50,
      backgroundColor: colors.borderDivider,
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

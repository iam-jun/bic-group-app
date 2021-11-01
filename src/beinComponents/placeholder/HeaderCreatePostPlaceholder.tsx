import React, {FC} from 'react';
import {StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
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
  parentWidth?: number;
}

const HeaderCreatePostPlaceholder: FC<CreatePostHeaderPlaceholderProps> = ({
  style,
  parentWidth,
}: CreatePostHeaderPlaceholderProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <Placeholder
      Animation={ShineOverlay}
      Left={props => <PlaceholderMedia style={[props.style, styles.left]} />}
      style={StyleSheet.flatten([
        styles.container,
        parentWidth && parentWidth > theme.dimension.maxNewsfeedWidth
          ? styles.containerForBigParent
          : {},
        style,
      ])}>
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
    containerForBigParent: {
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
          borderRadius: 6,
        },
      }),
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

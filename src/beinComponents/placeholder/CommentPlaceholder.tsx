import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  ShineOverlay,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';

import {ITheme} from '~/theme/interfaces';
import {getRandomInt} from '~/utils/generator';

export interface CommentPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const CommentPlaceholder: React.FC<CommentPlaceholderProps> = ({
  style,
  disableRandom,
}: CommentPlaceholderProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Placeholder
        Animation={ShineOverlay}
        Left={p => <PlaceholderMedia style={[p.style, styles.avatar]} />}
        style={styles.infoContainer}>
        <Placeholder Animation={ShineOverlay} style={styles.contentContainer}>
          <PlaceholderLine width={disableRandom ? 50 : getRandomInt(30, 60)} />
          <PlaceholderLine
            width={disableRandom ? 60 : getRandomInt(30, 80)}
            style={styles.secondLine}
          />
        </Placeholder>
      </Placeholder>
    </View>
  );
};

export default CommentPlaceholder;

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    secondLine: {
      marginBottom: spacing.margin.small,
      backgroundColor: '#EAEDF2',
    },
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.tiny,
    },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    avatar: {
      width: 40,
      height: 40,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      padding: spacing.padding.small,
      backgroundColor: '#F9FAFB',
      borderRadius: spacing.borderRadius.small,
    },
  });
};

import React from 'react';
import {
  StyleSheet, View, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  ShineOverlay,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { getRandomInt } from '~/utils/generator';

export interface CommentPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const CommentPlaceholder: React.FC<CommentPlaceholderProps> = ({
  style,
  disableRandom,
}: CommentPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Placeholder
        Animation={ShineOverlay}
        Left={(p) => <PlaceholderMedia style={styles.avatar} />}
        style={styles.infoContainer}
      >
        <Placeholder Animation={ShineOverlay} style={styles.contentContainer}>
          <PlaceholderLine width={disableRandom ? 50 : getRandomInt(
            30, 60,
          )}
          />
          <PlaceholderLine
            width={disableRandom ? 60 : getRandomInt(
              30, 80,
            )}
            style={styles.secondLine}
          />
        </Placeholder>
      </Placeholder>
    </View>
  );
};

export default CommentPlaceholder;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.tiny,
    },
    avatar: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      marginRight: spacing.margin.small,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
    },
    secondLine: {
      marginBottom: spacing.margin.small,
      backgroundColor: '#EAEDF2',
    },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    contentContainer: {
      flexDirection: 'row',
      padding: spacing.padding.small,
      backgroundColor: '#F9FAFB',
      borderRadius: spacing.borderRadius.small,
    },
  });
};

import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import { getRandomInt } from '~/utils/generator';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface ArticlePlaceholderProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const ArticlePlaceholder: FC<ArticlePlaceholderProps> = ({
  style,
  disableRandom,
  testID = 'article_placeholder',
}: ArticlePlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View testID={testID} style={[styles.container, style]}>
      <View style={[styles.row, styles.infoContainer]}>
        <Animated.View style={[styles.line, styles.avatar, animatedStyle]} />
        <View style={styles.flex1}>
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 50 : getRandomInt(
              30, 60,
            )}%`,
          }, animatedStyle]}
          />
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 60 : getRandomInt(
              30, 80,
            )}%`,
          }, animatedStyle]}
          />
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 40 : getRandomInt(
              30, 50,
            )}%`,
          }, animatedStyle]}
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        {Array.from(Array(disableRandom ? 5 : getRandomInt(
          3, 10,
        )).keys()).map((item) => (
          <Animated.View
            key={`line_${item}`}
            style={[styles.line, animatedStyle]}
          />
        ))}
        <Animated.View style={[styles.line, {
          width: `${disableRandom ? 45 : getRandomInt(
            20, 80,
          )}%`,
        }, animatedStyle]}
        />
      </View>
      <Animated.View
        style={[styles.line, styles.image, animatedStyle]}
      />
      <View style={styles.bottomContainer}>
        {Array.from(Array(disableRandom ? 5 : getRandomInt(
          3, 10,
        )).keys()).map((item) => (
          <Animated.View
            key={`line_${item}`}
            style={[styles.line, animatedStyle]}
          />
        ))}
        <Animated.View style={[styles.line, {
          width: `${disableRandom ? 45 : getRandomInt(
            20, 80,
          )}%`,
        }, animatedStyle]}
        />
      </View>
      <View style={[styles.row, styles.buttonWrapper]}>
        <View style={[styles.row, styles.buttonContainer]}>
          <Animated.View
            style={[styles.line, styles.icon, animatedStyle]}
          />
          <ViewSpacing width={spacing.margin.base} />
          <Animated.View
            style={[styles.line, styles.buttonContent, animatedStyle]}
          />
        </View>
        <Divider horizontal style={styles.divider} />
        <View style={[styles.row, styles.buttonContainer]}>
          <Animated.View
            style={[styles.line, styles.icon, animatedStyle]}
          />
          <ViewSpacing width={spacing.margin.base} />
          <Animated.View
            style={[styles.line, styles.buttonContent, animatedStyle]}
          />
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    line: {
      height: spacing.margin.base,
      borderRadius: spacing.margin.tiny,
      backgroundColor: colors.neutral5,
      marginVertical: spacing.margin.tiny,
    },
    margin0: { marginTop: 0, marginBottom: 0 },
    container: {
      backgroundColor: colors.white,
      marginBottom: spacing.margin.base,
    },
    importantContainer: {
      backgroundColor: colors.neutral5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.base,
    },
    importantTitle: {
      marginLeft: spacing.margin.large,
      width: 135,
      height: 15,
    },
    iconStar: { width: 28, height: 28 },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    content: {
      height: 40,
      marginBottom: 0,
      marginTop: 0,
      borderRadius: 100,
    },
    avatar: {
      width: 52,
      height: 52,
      marginRight: 8,
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: 0,
    },
    bottomContainer: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: 0,
      marginTop: 16,
    },
    image: {
      borderRadius: 0,
      height: 200,
      width: '100%',
      marginTop: spacing.margin.base,
    },
    icon: {
      width: 16,
      height: 16,
    },
    buttonWrapper: { height: 40 },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    buttonContent: {
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: { height: '65%', alignSelf: 'center' },
  });
};

export default ArticlePlaceholder;

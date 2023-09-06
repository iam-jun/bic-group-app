import React from 'react';
import {
  StyleSheet, View, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import spacing from '~/theme/spacing';
import { getRandomInt } from '~/utils/generator';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '../../beinComponents/ViewSpacing';

export interface GroupProfilePlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const GroupProfilePlaceholder: React.FC<GroupProfilePlaceholderProps> = ({
  style,
  disableRandom,
}: GroupProfilePlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.line, styles.cover, animatedStyle]} />
      <View style={styles.groupInfoHeaderContainer}>
        <View style={[styles.row, styles.infoContainer]}>
          <Animated.View style={[styles.line, styles.avatar, animatedStyle]} />
          <ViewSpacing width={spacing.margin.base} />
          <View style={styles.flex1}>
            <Animated.View style={[styles.line, {
              width: `${disableRandom ? 50 : getRandomInt(
                30, 60,
              )}%`,
            }, animatedStyle]}
            />
            <View style={styles.infoText}>
              <Animated.View style={[styles.line, {
                width: `${disableRandom ? 4 : getRandomInt(
                  3, 8,
                )}%`,
              }, animatedStyle]}
              />
              <ViewSpacing width={spacing.margin.small} />
              <Animated.View style={[styles.line, {
                width: `${disableRandom ? 25 : getRandomInt(
                  10, 20,
                )}%`,
              }, animatedStyle]}
              />
              <ViewSpacing width={spacing.margin.small} />
              <Animated.View style={[styles.line, {
                width: `${disableRandom ? 15 : getRandomInt(
                  10, 20,
                )}%`,
              }, animatedStyle]}
              />
            </View>
          </View>
        </View>
        <View style={styles.tabButton}>
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 25 : getRandomInt(
              10, 20,
            )}%`,
          }, animatedStyle]}
          />
          <ViewSpacing width={spacing.margin.small} />
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 15 : getRandomInt(
              10, 20,
            )}%`,
          }, animatedStyle]}
          />
          <ViewSpacing width={spacing.margin.small} />
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 20 : getRandomInt(
              10, 20,
            )}%`,
          }, animatedStyle]}
          />
          <ViewSpacing width={spacing.margin.small} />
          <Animated.View style={[styles.line, {
            width: `${disableRandom ? 22 : getRandomInt(
              10, 20,
            )}%`,
          }, animatedStyle]}
          />
        </View>
      </View>
    </View>
  );
};

export default GroupProfilePlaceholder;

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
    container: {
      backgroundColor: colors.white,
      marginBottom: spacing.margin.small,
    },
    cover: {
      borderRadius: 0,
      height: 200,
      width: '100%',
      marginTop: spacing.margin.base,
    },
    avatar: {
      width: 52,
      height: 52,
    },
    groupInfoHeaderContainer: {
      backgroundColor: colors.white,
    },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.xSmall,
      alignItems: 'center',
    },
    marginLeft: {
      marginLeft: spacing.margin.small,
    },
    tabButton: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.base,
      marginBottom: spacing.margin.base,
    },
    infoText: { flexDirection: 'row' },
  });
};

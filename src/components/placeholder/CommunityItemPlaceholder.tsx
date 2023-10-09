import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { getRandomInt } from '~/utils/generator';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '../../beinComponents/ViewSpacing';

export interface CommunityItemPlaceholderProps {
    shouldShowCommunityInHeader?: boolean;
}

const CommunityItemPlaceholder = ({ shouldShowCommunityInHeader = false }:CommunityItemPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={styles.container}>
      {
            Boolean(shouldShowCommunityInHeader) && (
            <>
              <Animated.View style={[styles.line, styles.communityName, animatedStyle]} />
              <ViewSpacing height={spacing.margin.small} />
            </>
            )
        }
      <View style={styles.row}>
        <Animated.View style={[styles.avatar, animatedStyle]} />
        <View>
          <Animated.View style={[styles.line, styles.communityName, animatedStyle]} />
          <ViewSpacing height={spacing.margin.small} />
          <View style={styles.row}>
            <Animated.View style={[styles.line, styles.icon, animatedStyle]} />
            <ViewSpacing width={spacing.margin.tiny} />
            <Animated.View style={[styles.line, styles.textAfterIcon, animatedStyle]} />
            <ViewSpacing width={spacing.margin.small} />
            <Animated.View style={[styles.line, styles.icon, animatedStyle]} />
            <ViewSpacing width={spacing.margin.tiny} />
            <Animated.View style={[styles.line, styles.textAfterIcon, animatedStyle]} />
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.line, styles.firstLine, animatedStyle]} />
        <ViewSpacing height={spacing.margin.small} />
        <Animated.View style={[styles.line, styles.secondLine, animatedStyle]} />
        <ViewSpacing height={spacing.margin.small} />
        <Animated.View style={[styles.line, styles.button, animatedStyle]} />
      </View>
    </View>
  );
};

export default CommunityItemPlaceholder;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
    },
    avatar: {
      width: dimension.avatarSizes.large,
      height: dimension.avatarSizes.large,
      marginRight: spacing.margin.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.neutral5,
    },
    contentContainer: {
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.large,
      borderRadius: spacing.borderRadius.small,
    },
    line: {
      height: spacing.margin.base,
      borderRadius: spacing.margin.xTiny,
      width: getRandomInt(80, 120),
      backgroundColor: colors.neutral5,
    },
    communityName: {
      width: getRandomInt(80, 120),
    },
    firstLine: {
      width: '100%',
    },
    secondLine: {
      width: '60%',
    },
    button: {
      height: 42,
      width: '100%',
    },
    icon: {
      width: 24,
      height: 24,
    },
    textAfterIcon: {
      width: 40,
    },
  });
};

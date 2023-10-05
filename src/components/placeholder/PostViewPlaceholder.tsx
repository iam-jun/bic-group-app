import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import Image from '~/components/Image';
import images from '~/resources/images';
import { getRandomInt } from '~/utils/generator';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '../../beinComponents/ViewSpacing';

export interface PostViewPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
  testID?: string;
}

const PostViewPlaceholder: FC<PostViewPlaceholderProps> = ({
  style,
  disableRandom,
  testID = 'post_view_placeholder',
}: PostViewPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View testID={testID} style={StyleSheet.flatten([styles.container, style])}>
      <View style={[styles.importantContainer, styles.row]}>
        <Animated.View style={[styles.line, animatedStyle]} />
        <Image style={styles.iconStar} source={images.ic_star_white} />
      </View>
      <View style={[styles.row, styles.infoContainer]}>
        <Animated.View style={[styles.line, styles.avatar, animatedStyle]} />
        <View style={styles.flex1}>
          <Animated.View
            style={[styles.line, {
              width: `${disableRandom ? 50 : getRandomInt(
                30, 60,
              )}%`,
            }, animatedStyle]}
          />
          <Animated.View
            style={[styles.line, {
              width: `${disableRandom ? 60 : getRandomInt(
                30, 80,
              )}%`,
            }, animatedStyle]}
          />
          <Animated.View
            style={[styles.line, {
              width: `${disableRandom ? 40 : getRandomInt(
                30, 50,
              )}%`,
            }, animatedStyle]}
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        {Array.from(Array(disableRandom ? 3 : getRandomInt(
          1, 5,
        )).keys()).map((item) => (
          <Animated.View
            key={`line_${item}`}
            style={[styles.line, {
              width: `${disableRandom ? 80 : getRandomInt(
                80, 100,
              )}%`,
            }, animatedStyle]}
          />
        ))}
        <Animated.View
          style={[styles.line, {
            width: `${disableRandom ? 45 : getRandomInt(
              20, 80,
            )}%`,
          }, animatedStyle]}
        />
      </View>
      <Animated.View
        style={[styles.line, styles.image, animatedStyle]}
      />
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
    importantContainer: {
      backgroundColor: colors.purple1,
      paddingVertical: spacing.padding.xTiny,
      paddingHorizontal: spacing.padding.base,
      justifyContent: 'space-between',
    },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    avatar: {
      width: 52,
      height: 52,
      marginRight: 8,
    },
    container: {
      backgroundColor: colors.white,
      marginBottom: spacing.margin.base,
    },
    importantTitle: {
      marginLeft: spacing.margin.large,
      width: 135,
      height: 15,
    },
    iconStar: { width: 28, height: 28 },
    content: {
      height: 40,
      marginBottom: 0,
      marginTop: 0,
      borderRadius: 100,
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: 0,
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
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
      height: spacing.margin.large,
    },
    divider: { height: '65%', alignSelf: 'center' },
  });
};

export default PostViewPlaceholder;

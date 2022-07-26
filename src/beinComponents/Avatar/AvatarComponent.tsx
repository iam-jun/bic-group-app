import React from 'react';
import {
  ImageStyle, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/beinComponents/Icon';
import Image, { ImageProps } from '~/beinComponents/Image';
import { IconType } from '~/resources/icons';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import Text from '../Text';

export type AvatarType =
  | 'tiny'
  | 'small'
  | 'smallAlt'
  | 'medium'
  | 'large'
  | 'largeAlt'
  | 'ultraSuperLarge';

export type AvatarStatus = 'online';

export interface AvatarProps extends ImageProps {
  style?: StyleProp<ImageStyle>;
  variant?: AvatarType;
  status?: AvatarStatus;
  actionIcon?: IconType;
  badge?: any;
  badgeBottom?: boolean;
  isRounded?: boolean;
  cache?: boolean;
  showBorder?: boolean;
  badgeCheck?: boolean;
  badgeCheckSize?: number;
  iconCheckSize?: number;
  counter?: number;
  onPressAction?: () => void;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  variant = 'medium',
  style,
  source,
  status,
  actionIcon,
  badge,
  badgeBottom,
  isRounded,
  showBorder,
  badgeCheck,
  badgeCheckSize = 16,
  iconCheckSize = 12,
  counter,
  onPressAction,
  ...props
}: AvatarProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = creatStyle(theme);

  const avatarSize = dimension?.avatarSizes[variant] || 24;
  const avatarContainerStyle: StyleProp<ViewStyle> = styles[variant];
  let avatarStyle: StyleProp<ImageStyle> = styles[variant];
  const borderStyle = showBorder ? styles.border : {};

  if (isRounded) {
    avatarStyle = StyleSheet.flatten([
      avatarStyle,
      { borderRadius: avatarSize / 2 },
    ]);
  }

  const renderAction = () => {
    if (!onPressAction) {
      return null;
    }

    const actionContainerSize = 16;
    const actionIconSize = 12;

    return (
      <View
        testID="avatar.action_icon"
        style={{
          position: 'absolute',
          top: -(spacing?.margin.tiny || 4),
          right: -(spacing?.margin.tiny || 4),
          width: actionContainerSize,
          height: actionContainerSize,
          borderRadius: actionContainerSize / 2,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {actionIcon && (
          <Icon
            testID="avatar.action_icon.button"
            size={actionIconSize}
            icon={actionIcon}
            onPress={onPressAction}
          />
        )}
      </View>
    );
  };

  const renderStatus = () => {
    if (!status) {
      return null;
    }

    // todo update in specific case
    const statusSize = avatarSize / 3;
    const statusColor = colors.success;

    return (
      <View
        testID="avatar.status"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: statusSize,
          height: statusSize,
          borderRadius: statusSize / 2,
          backgroundColor: statusColor,
          borderWidth: 1,
          borderColor: colors.white,
        }}
      />
    );
  };

  const renderBadge = () => {
    if (!badge) {
      return null;
    }

    // todo update in specific case
    const badgeContainerSize = avatarSize / 2;
    const badgeSize = badgeContainerSize * 0.45;

    const absTop = -(spacing?.margin.small || 8);
    const absBottom = -(spacing?.margin.tiny || 4);
    const absRight = -(spacing?.margin.small || 8);

    return (
      <View
        testID="avatar.badge"
        style={{
          position: 'absolute',
          top: badgeBottom ? undefined : absTop,
          bottom: badgeBottom ? absBottom : undefined,
          right: absRight,
          width: badgeContainerSize,
          height: badgeContainerSize,
          borderRadius: badgeContainerSize / 2,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOffset: { width: 0, height: 1 },
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <Icon size={badgeSize} icon={badge} />
      </View>
    );
  };

  const renderBadgeCheck = () => {
    if (!badgeCheck) {
      return null;
    }
    return (
      <View
        testID="avatar.badge_check"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: badgeCheckSize,
          height: badgeCheckSize,
          borderRadius: badgeCheckSize / 2,
          backgroundColor: colors.success,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.white,
          shadowOffset: { width: 0, height: 1 },
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <Icon size={iconCheckSize} icon="Check" tintColor={colors.neutral80} />
      </View>
    );
  };

  return (
    <View
      testID="avatar"
      style={StyleSheet.flatten([avatarContainerStyle, style])}
    >
      <View
        testID="avatar_container"
        style={StyleSheet.flatten([
          avatarStyle,
          source ? {} : { backgroundColor: colors.gray40 },
        ])}
      >
        <Image
          testID="avatar.image"
          style={[avatarStyle, borderStyle]}
          source={source}
          {...props}
        />
        {counter ? (
          <View style={[avatarStyle, styles.textStyle]}>
            <Text.BodyS color={theme.colors.white}>
              +
              {counter}
            </Text.BodyS>
          </View>
        ) : null}
        {renderStatus()}
        {renderAction()}
        {renderBadge()}
        {renderBadgeCheck()}
      </View>
    </View>
  );
};

const creatStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    tiny: {
      width: dimension?.avatarSizes?.tiny,
      height: dimension?.avatarSizes?.tiny,
      borderRadius: (dimension?.avatarSizes?.tiny || 16) / 2,
    },
    small: {
      width: dimension?.avatarSizes?.small,
      height: dimension?.avatarSizes?.small,
      borderRadius: spacing?.borderRadius.small,
    },
    smallAlt: {
      width: dimension?.avatarSizes?.smallAlt,
      height: dimension?.avatarSizes?.smallAlt,
      borderRadius: spacing?.borderRadius.large,
    },
    medium: {
      width: dimension?.avatarSizes?.medium,
      height: dimension?.avatarSizes?.medium,
      borderRadius: spacing?.borderRadius.small,
    },
    large: {
      width: dimension?.avatarSizes?.large,
      height: dimension?.avatarSizes?.large,
      borderRadius: spacing?.borderRadius.small,
    },
    largeAlt: {
      width: dimension?.avatarSizes?.largeAlt,
      height: dimension?.avatarSizes?.largeAlt,
      borderRadius: (spacing?.borderRadius.small || 6) + 2,
    },
    ultraSuperLarge: {
      width: dimension?.avatarSizes?.ultraSuperLarge,
      height: dimension?.avatarSizes?.ultraSuperLarge,
      borderRadius: (spacing?.borderRadius.small || 6) + 2,
    },
    border: {
      borderWidth: 4,
      borderColor: colors.white,
    },
    textStyle: {
      backgroundColor: colors.transparent1,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default AvatarComponent;

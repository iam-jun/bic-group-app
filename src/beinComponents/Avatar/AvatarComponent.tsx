import React from 'react';
import {ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import Image, {ImageProps} from '~/beinComponents/Image';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';

export type AvatarType =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'largeAlt'
  | 'ultraSuperLarge';

export type AvatarStatus = 'online';

export interface AvatarProps extends ImageProps {
  style?: StyleProp<ViewStyle>;
  variant?: AvatarType;
  status?: AvatarStatus;
  actionIcon?: IconType;
  onPressAction?: () => void;
  badge?: any;
  badgeBottom?: boolean;
  isRounded?: boolean;
  cache?: boolean;
  badgeCheck?: boolean;
  badgeCheckSize?: number;
  iconCheckSize?: number;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  variant = 'medium',
  style,
  source,
  status,
  actionIcon,
  onPressAction,
  badge,
  badgeBottom,
  isRounded,
  badgeCheck,
  badgeCheckSize = 16,
  iconCheckSize = 12,
  ...props
}: AvatarProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, dimension, colors} = theme;
  const styles = creatStyle(theme);

  const avatarSize = dimension?.avatarSizes[variant] || 24;
  const avatarContainerStyle: StyleProp<ViewStyle> = styles[variant];
  let avatarStyle: StyleProp<ImageStyle> = styles[variant];

  if (isRounded) {
    avatarStyle = StyleSheet.flatten([
      avatarStyle,
      {borderRadius: avatarSize / 2},
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
        style={{
          position: 'absolute',
          top: -(spacing?.margin.tiny || 4),
          right: -(spacing?.margin.tiny || 4),
          width: actionContainerSize,
          height: actionContainerSize,
          borderRadius: actionContainerSize / 2,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {actionIcon && (
          <Icon
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

    //todo update in specific case
    const statusSize = avatarSize / 3;
    const statusColor = colors.success;

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: statusSize,
          height: statusSize,
          borderRadius: statusSize / 2,
          backgroundColor: statusColor,
          borderWidth: 1,
          borderColor: colors.background,
        }}
      />
    );
  };

  const renderBadge = () => {
    if (!badge) {
      return null;
    }

    //todo update in specific case
    const badgeContainerSize = avatarSize / 2;
    const badgeSize = badgeContainerSize * 0.45;

    const absTop = -(spacing?.margin.small || 8);
    const absBottom = -(spacing?.margin.tiny || 4);
    const absRight = -(spacing?.margin.small || 8);

    return (
      <View
        style={{
          position: 'absolute',
          top: badgeBottom ? undefined : absTop,
          bottom: badgeBottom ? absBottom : undefined,
          right: absRight,
          width: badgeContainerSize,
          height: badgeContainerSize,
          borderRadius: badgeContainerSize / 2,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOffset: {width: 0, height: 1},
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}>
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
          borderColor: colors.background,
          shadowOffset: {width: 0, height: 1},
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}>
        <Icon
          size={iconCheckSize}
          icon="UilCheck"
          tintColor={colors.iconTintReversed}
        />
      </View>
    );
  };

  return (
    <View style={StyleSheet.flatten([avatarContainerStyle, style])}>
      <View
        style={StyleSheet.flatten([
          avatarStyle,
          source ? {} : {backgroundColor: colors.borderCard},
        ])}>
        <Image style={avatarStyle} source={source} {...props} />
        {renderStatus()}
        {renderAction()}
        {renderBadge()}
        {renderBadgeCheck()}
      </View>
    </View>
  );
};

const creatStyle = (theme: ITheme) => {
  const {spacing, dimension} = theme;
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
  });
};

export default AvatarComponent;

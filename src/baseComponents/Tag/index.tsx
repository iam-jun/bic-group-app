import React from 'react';
import {
  StyleProp, StyleSheet, TextStyle, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text, { TextProps } from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Avatar from '~/baseComponents/Avatar';
import Icon from '../Icon';
import Button, { ButtonProps } from '../Button';
import { AvatarType } from '../Avatar/AvatarComponent';

export type TagType = 'primary' | 'secondary' | 'neutral' | 'tags';
export type TagSize = 'small' | 'medium' | 'large';

export interface TagProps {
  type?: TagType,
  size?: TagSize,
  avatar?: any;
  label: string;
  icon?: any;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textProps?: TextProps;
  textStyle?: StyleProp<TextStyle>;
  buttonProps?: ButtonProps;
  testID?: string;
  RightComponent?: React.ReactNode | React.ReactElement;
  onActionPress?: () => void;
  onPressIcon?: () => void;
}

const Tag: React.FC<TagProps> = ({
  type = 'primary',
  size = 'small',
  avatar,
  label,
  icon,
  disabled,
  style,
  textProps,
  textStyle,
  buttonProps,
  testID,
  RightComponent,
  onActionPress,
  onPressIcon,
}: TagProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, type, size,
  );

  const getVariant = () => {
    switch (size) {
      case 'medium':
        return 'bodyS';
      case 'large':
        return 'bodyM';
      default:
        return 'bodyXS';
    }
  };
  const variant = getVariant();

  const avatarVariant = getAvatarVariant(size);

  return (
    <Button
      testID={testID || 'tag.item'}
      disabled={disabled}
      style={[styles.container, style,
        avatar ? styles.buttonAvatar : {},
        icon ? styles.buttonIcon : styles.buttonWithoutIcon,
      ]}
      onPress={() => { onActionPress?.(); }}
      {...buttonProps}
    >
      {!!avatar && <Avatar variant={avatarVariant} source={avatar} style={styles.avatar} isRounded />}
      {!!label && (
        <Text variant={variant} testID="tag.label" style={[styles.labelText, textStyle]} {...textProps}>
          {label}
        </Text>
      )}
      {!disabled && onPressIcon && !!icon && (
        <Icon
          testID="tag.icon"
          style={styles.icon}
          icon={icon}
          size={12}
          tintColor={disabled ? theme.colors.gray40 : theme.colors.neutral80}
          disabled={disabled}
          onPress={onPressIcon}
        />
      )}
      {RightComponent}
    </Button>
  );
};

const getAvatarVariant = (tagSize?: TagSize): AvatarType => {
  switch (tagSize) {
    case 'small':
      return 'tiny';
    case 'medium':
      return 'xSmall';
    case 'large':
      return 'small';
    default:
      return 'tiny';
  }
};

const createStyles = (
  theme: ExtendedTheme,
  type: TagType,
  size: TagSize,
) => {
  const { colors } = theme;

  const tagSizes = {
    small: {
      containerHeight: 24,
    },
    medium: {
      fontSize: dimension?.sizes.bodyS,
      containerHeight: 28,
    },
    large: {
      fontSize: dimension?.sizes.bodyM,
      containerHeight: 32,
    },
  };

  const tagTypes = {
    primary: {
      containerBackgroundColor: colors.purple2,
      textColor: colors.purple50,
    },
    secondary: {
      containerBackgroundColor: colors.blue2,
      textColor: colors.blue50,
    },
    neutral: {
      containerBackgroundColor: colors.neutral2,
      textColor: colors.gray80,
    },
    tags: {
      containerBackgroundColor: colors.white,
      textColor: colors.neutral40,
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
  };

  const { containerHeight } = tagSizes[size];
  const { containerBackgroundColor, textColor, ...restOfStyle } = tagTypes[type];

  return StyleSheet.create({
    container: {
      backgroundColor: containerBackgroundColor,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: containerHeight,
      marginRight: spacing.margin.small,
      paddingLeft: spacing.padding.tiny,
      ...restOfStyle,
    },
    labelText: {
      color: textColor,
      paddingLeft: spacing.margin.tiny,
      flexShrink: 1,
    },
    icon: {
      marginLeft: spacing?.margin.tiny,
    },
    avatar: {
    },
    buttonAvatar: {
      paddingLeft: 0,
    },
    buttonIcon: {
      paddingRight: spacing.padding.tiny,
    },
    buttonWithoutIcon: {
      paddingRight: spacing.padding.small,
    },
  });
};

export default Tag;

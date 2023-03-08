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

export type TagType = 'primary' | 'secondary' | 'neutral' | 'tags';
export type TagSize = 'small' | 'medium' | 'large';

export interface TagProps {
  type?: TagType,
  size?: TagSize,
  avatar?: any;
  label: string;
  icon?: any;
  disabled?: boolean;
  onActionPress?: () => void;
  onPressIcon?: () => void;
  style?: StyleProp<ViewStyle>;
  textProps?: TextProps;
  textStyle?: StyleProp<TextStyle>;
  buttonProps?: ButtonProps;
  testID?: string;
}

const Tag: React.FC<TagProps> = ({
  type = 'primary',
  size = 'small',
  avatar,
  label,
  icon,
  disabled,
  onActionPress,
  onPressIcon,
  style,
  textProps,
  textStyle,
  buttonProps,
  testID,
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

  return (
    <Button
      testID={testID || 'tag.item'}
      disabled={disabled}
      style={[styles.container, style,
        !!avatar ? styles.buttonAvatar : {},
        !!icon ? styles.buttonIcon : styles.buttonWithoutIcon,
      ]}
      onPress={() => { onActionPress?.(); }}
      {...buttonProps}
    >
      {!!avatar && <Avatar.Tiny source={avatar} style={styles.avatar} />}
      {!!label
      && (
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
    </Button>
  );
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
    },
    icon: {
      marginStart: spacing?.margin.tiny,
    },
    avatar: {
    },
    buttonAvatar: {
      paddingLeft: spacing.padding.tiny,
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

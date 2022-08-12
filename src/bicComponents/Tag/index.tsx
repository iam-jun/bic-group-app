import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Avatar from '~/bicComponents/Avatar';
import Icon from '../../beinComponents/Icon';

export type TagType = 'primary' | 'secondary' | 'neutral';
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
}: TagProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, type, size,
  );

  const getVariant = () => {
    switch (size) {
      case 'medium':
        return 'bodyS'
      case 'large':
        return 'bodyM'
      default:
        return 'bodyXS'
    }
  }
  const variant = getVariant();

  return (
    <TouchableOpacity
      testID="tag.item"
      disabled={disabled}
      style={[styles.container, style, {
        paddingLeft: !!avatar ? 0 : spacing.padding.small,
        paddingRight: !!icon ? spacing.padding.tiny : spacing.padding.small,
      }]}
      onPress={() => { onActionPress?.() }}
    >
      {!!avatar && <Avatar.Tiny source={avatar} style={styles.avatar} />}
      <Text variant={variant} testID="tag.label" style={styles.labelText}>{label}</Text>
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
    </TouchableOpacity>
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
  }

  const { containerHeight } = tagSizes[size];
  const { containerBackgroundColor, textColor } = tagTypes[type];

  return StyleSheet.create({
    container: {
      backgroundColor: containerBackgroundColor,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: containerHeight,
      marginRight: spacing.margin.small,
    },
    labelText: {
      color: textColor,
    },
    icon: {
      marginStart: spacing?.margin.tiny,
    },
    avatar: {
      marginRight: spacing?.margin.tiny,
    },
  });
};

export default Tag;

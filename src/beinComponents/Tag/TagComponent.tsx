import React, { useState } from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '../Icon';

import Text, { TextVariant } from '~/beinComponents/Text';
import commonActions, { IAction } from '~/constants/commonActions';
import Avatar from '~/beinComponents/Avatar';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export type TagVariants = 'small' | 'medium';

export interface TagProps {
  variant?: TagVariants;
  textVariant?: TextVariant;
  avatar?: any;
  label: string;
  icon?: any;
  selected?: boolean;
  disabled?: boolean;
  onActionPress?: (action: IAction) => void;
  onPressIcon?: () => void;
  style?: StyleProp<ViewStyle>;
}

const TagComponent: React.FC<TagProps> = ({
  variant = 'medium',
  avatar,
  label,
  icon = 'Xmark',
  selected = false,
  disabled = false,
  onActionPress,
  onPressIcon,
  style,
}: TagProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme, variant, isSelected, disabled);

  const _onChangeValue = () => {
    if (onActionPress) {
      const newValue = !isSelected;
      setIsSelected(newValue);
      if (newValue) {
        onActionPress?.(commonActions.selectEmoji as IAction);
      } else {
        onActionPress?.(commonActions.unselectEmoji as IAction);
      }
    }
  };

  if (!avatar && !label) {
    return null;
  }

  return (
    <TouchableOpacity
      testID="tag.item"
      disabled={disabled}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={_onChangeValue}
    >
      {avatar && <Avatar.Tiny source={avatar} style={styles.avatar} />}
      <Text style={StyleSheet.flatten([styles.labelText])}>{label}</Text>
      {!disabled && onPressIcon && (
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
  variant: TagVariants,
  isSelected: boolean,
  disabled: boolean,
) => {
  const { colors } = theme;

  const tagVariants = {
    small: {
      fontSize: dimension?.sizes.bodyS,
      paddingHorizontal: spacing?.padding.small || 8,
    },
    medium: {
      fontSize: dimension?.sizes.bodyS,
      paddingHorizontal: spacing?.padding.large || 16,
    },
  };
  const { fontSize, paddingHorizontal } = tagVariants[variant];

  let _textColor;
  let _backgroundColor = colors.violet1;
  let _fontFamily = fontFamilies.BeVietnamProLight;
  if (disabled) {
    _backgroundColor = colors.gray20;
    _textColor = colors.gray40;
  } else {
    _textColor = isSelected ? colors.purple60 : colors.purple60;
    _fontFamily = isSelected
      ? fontFamilies.BeVietnamProSemiBold
      : fontFamilies.BeVietnamProLight;
  }

  return StyleSheet.create({
    container: {
      backgroundColor: _backgroundColor,
      borderRadius: 100,
      paddingVertical: 6,
      paddingHorizontal,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    labelText: {
      fontSize,
      fontFamily: _fontFamily,
      color: _textColor,
    },
    icon: {
      marginStart: spacing?.margin.small,
    },
    avatar: {
      marginRight: spacing?.margin.small,
    },
  });
};

export default TagComponent;

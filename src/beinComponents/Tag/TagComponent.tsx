import React, {useState} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text, {TextVariant} from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';
import Avatar from '~/beinComponents/Avatar';
import {fontFamilies} from '~/theme/fonts';

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
  icon = 'Times',
  selected = false,
  disabled = false,
  onActionPress,
  onPressIcon,
  style,
}: TagProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ITheme = useTheme();
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
      onPress={_onChangeValue}>
      {avatar && <Avatar.Tiny source={avatar} style={styles.avatar} />}
      <Text style={StyleSheet.flatten([styles.labelText])}>{label}</Text>
      {!disabled && onPressIcon && (
        <Icon
          testID="tag.icon"
          style={styles.icon}
          icon={icon}
          size={12}
          tintColor={
            disabled ? theme.colors.textDisabled : theme.colors.iconTint
          }
          disabled={disabled}
          onPress={onPressIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const createStyles = (
  theme: ITheme,
  variant: TagVariants,
  isSelected: boolean,
  disabled: boolean,
) => {
  const {colors, spacing, dimension} = theme;

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
  const {fontSize, paddingHorizontal} = tagVariants[variant];

  let _textColor;
  let _backgroundColor = colors.primary1;
  let _fontFamily = fontFamilies.BeVietnamProLight;
  if (disabled) {
    _backgroundColor = colors.bgDisable;
    _textColor = colors.textDisabled;
  } else {
    _textColor = isSelected ? colors.primary : colors.primary7;
    _fontFamily = isSelected
      ? fontFamilies.BeVietnamProSemiBold
      : fontFamilies.BeVietnamProLight;
  }

  return StyleSheet.create({
    container: {
      backgroundColor: _backgroundColor,
      borderRadius: 100,
      paddingVertical: 6,
      paddingHorizontal: paddingHorizontal,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    labelText: {
      fontSize: fontSize,
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

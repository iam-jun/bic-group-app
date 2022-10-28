import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IconType } from '~/resources/icons';
import Text, { TextVariant } from '~/beinComponents/Text';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';

export interface RadioProps {
  testID?: string;
  style?: StyleProp<ViewStyle>
  isChecked: boolean;
  disabled?: 'disabled' | 'disabled-auto-selected';
  size?: 'small' | 'medium';
  label?: string;
  useI18n?: boolean;
  onPress?: () => void;
}

const Radio = ({
  testID,
  style,
  isChecked = false,
  disabled,
  size = 'medium',
  label,
  useI18n,
  onPress,
}: RadioProps) => {
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyles(theme);
  const { colors } = theme;

  const currentState = disabled || (isChecked ? 'selected' : 'unselect');

  const onChangeValue = () => {
    onPress?.();
  };

  const radioStyles = {
    // based on prop `state`
    unselect: {
      iconName: 'Circle' as IconType,
      iconColor: colors.neutral20,
      labelColor: colors.neutral80,
    },
    selected: {
      iconName: 'CircleDotSolid' as IconType,
      iconColor: colors.blue50,
      labelColor: colors.neutral80,
    },
    disabled: {
      iconName: 'Circle' as IconType,
      iconColor: colors.gray20,
      labelColor: colors.gray20,
    },
    'disabled-auto-selected': {
      iconName: 'CircleDotSolid' as IconType,
      iconColor: colors.blue20,
      labelColor: colors.neutral80,
    },

    // based on prop `size`
    medium: {
      textVariant: 'labelM' as TextVariant,
      iconSize: 22,
    },
    small: {
      textVariant: 'labelS' as TextVariant,
      iconSize: 18,
    },
  };

  const { iconName, iconColor, labelColor } = radioStyles[currentState];
  const { textVariant, iconSize } = radioStyles[size];

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.container, style]}
      disabled={!!disabled}
      onPress={onChangeValue}
    >
      <View style={styles.backgroundView} />
      <Icon icon={iconName} size={iconSize} tintColor={iconColor} />
      {!!label && (
        <Text
          style={styles.labelText}
          variant={textVariant}
          color={labelColor}
          useI18n={useI18n}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Radio;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelText: {
      marginLeft: spacing.margin.small,
    },
    backgroundView: {
      position: 'absolute',
      top: 2,
      left: 1,
      right: 1,
      bottom: 2,
      borderRadius: borderRadius.circle,
      backgroundColor: colors.neutral,
    },
  });
};

import {
  StyleProp, StyleSheet, ViewStyle, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Text, { TextVariant } from '~/baseComponents/Text';
import { IconType } from '~/resources/icons';
import { spacing } from '~/theme';
import Button from '../Button';

export interface CheckboxProps {
  testID?: string;
  style?: StyleProp<ViewStyle>
  isChecked?: boolean;
  indeterminate?: boolean;
  disabled?: 'disabled' | 'disabled-auto-selected';
  size?: 'small' | 'medium';
  label?: string;
  useI18n?: boolean;
  onPress?: (isChecked?: boolean) => void;
}

const Checkbox = ({
  testID,
  style,
  isChecked = false,
  indeterminate = false,
  disabled,
  size = 'medium',
  label,
  useI18n,
  onPress,
}: CheckboxProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  const [checked, setChecked] = useState(isChecked);
  const currentState = getCurrentState(disabled, indeterminate, checked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const onChangeValue = () => {
    const newValue = !checked;
    onPress?.(newValue);
    setChecked(newValue);
  };

  const checkBoxStyles = {
    // based on prop `state`
    unselect: {
      iconName: 'Square' as IconType,
      iconColor: colors.neutral20,
      labelColor: colors.neutral80,
    },
    selected: {
      iconName: 'SquareCheckSolid' as IconType,
      iconColor: colors.blue50,
      labelColor: colors.neutral80,
    },
    indeterminate: {
      iconName: 'SquareMinus' as IconType,
      iconColor: colors.blue20,
      labelColor: colors.neutral80,
    },
    disabled: {
      iconName: 'Square' as IconType,
      iconColor: colors.gray20,
      labelColor: colors.gray20,
    },
    'disabled-auto-selected': {
      iconName: 'SquareCheckSolid' as IconType,
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

  const { iconName, iconColor, labelColor } = checkBoxStyles[currentState];
  const { textVariant, iconSize } = checkBoxStyles[size];

  return (
    <Button
      testID={testID}
      disabled={!!disabled || !!indeterminate}
      onPress={onChangeValue}
    >
      <View style={[styles.container, style]}>
        <View style={[styles.backgroundView, disabled && styles.backgroundViewDisabled]} />
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
      </View>
    </Button>
  );
};

export default Checkbox;

const getCurrentState = (disabled: string, indeterminate: boolean, checked:boolean) => {
  if (disabled) {
    return disabled;
  }
  if (indeterminate) {
    return 'indeterminate';
  }
  return checked ? 'selected' : 'unselect';
};

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
      left: 2,
      right: 2,
      bottom: 2,
      backgroundColor: colors.neutral,
    },
    backgroundViewDisabled: {
      backgroundColor: colors.gray5,
    },
  });
};

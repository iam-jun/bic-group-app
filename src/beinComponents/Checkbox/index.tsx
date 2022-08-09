import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native'
import React, { useState } from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '../Icon';
import { IconType } from '~/resources/icons';
import Text, { TextVariant } from '../Text';
import { spacing } from '~/theme';

interface CheckboxProps {
  testID?: string;
  style?: StyleProp<ViewStyle>
  type: 'unselect' | 'selected' | 'indeterminate' | 'disabled' | 'disabled-auto-selected'
  size?: 'small' | 'medium';
  label?: string;
  useI18n?: boolean;
  onPress?: () => void;
}

const Checkbox = ({
  testID,
  style,
  type = 'unselect',
  size = 'medium',
  label,
  useI18n,
  onPress,
}: CheckboxProps) => {
  const [currentState, setCurrentState] = useState(type);
  const theme = useTheme() as ExtendedTheme;
  const { colors } = theme;
  const isDisabled = type !== 'selected' && type !== 'unselect'

  const onChangeValue = () => {
    if (currentState === 'selected') {
      setCurrentState('unselect');
    } else {
      setCurrentState('selected');
    }
  }

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
      iconColor: colors.neutral20,
      labelColor: colors.neutral20,
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
  }

  const { iconName, iconColor, labelColor } = checkBoxStyles[isDisabled ? type : currentState];
  const { textVariant, iconSize } = checkBoxStyles[size]

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.container, style]}
      disabled={isDisabled}
      onPress={onChangeValue}
    >
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
  )
}

export default Checkbox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    marginLeft: spacing.margin.small,
  },
})

import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native'
import React from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text, { TextVariant } from '../Text';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';
import elevation from '~/theme/elevations';

interface TabButtonProps {
  children?: string;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
  type?: 'primary' | 'secondary' | 'neutral';
  size?: 'large' | 'medium' | 'small';
  onPress?: (e: any) => void;
}

const textVariant = {
  large: 'tabL' as TextVariant,
  medium: 'tabM' as TextVariant,
  small: 'tabS' as TextVariant,
};

const TabButton = ({
  children,
  style,
  isSelected = true,
  type = 'neutral',
  size = 'medium',
}: TabButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme)

  return (
    <TouchableOpacity style={[styles.container, isSelected && styles[type], styles[`${size}Padding`], style]}>
      <Text
        variant={textVariant[size]}
        style={[
          styles.text,
          isSelected ? styles[`${type}Text`] : styles.neutralText,
        ]}
      >
        {children}

      </Text>
    </TouchableOpacity>
  )
}

export default TabButton;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderRadius: borderRadius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: elevation.light.e1,
    },

    // background color
    primary: {
      backgroundColor: colors.purple2,
    },
    secondary: {
      backgroundColor: colors.blue2,
    },
    neutral: {
      backgroundColor: colors.neutral2,
    },

    // size padding
    largePadding: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    mediumPadding: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    smallPadding: {
      paddingVertical: spacing.padding.xSmall,
      paddingHorizontal: spacing.padding.base,
    },

    // text color
    text: {},
    primaryText: {
      color: colors.purple50,
    },
    secondaryText: {
      color: colors.blue50,
    },
    neutralText: {
      color: colors.neutral40,
    },
  })
}

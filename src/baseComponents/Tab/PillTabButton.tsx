import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text, { TextVariant } from '~/baseComponents/Text';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';
import elevation from '~/theme/elevations';
import { TabButtonProps } from './TabButton';
import Icon from '../Icon';

export interface PillTabButtonProps extends TabButtonProps {
  type?: 'primary' | 'secondary' | 'neutral';
  icon?: any;
  onPressIcon?: () => void;
}

const textVariant = {
  large: 'tabL' as TextVariant,
  medium: 'tabM' as TextVariant,
  small: 'tabS' as TextVariant,
};

const PillTabButton = ({
  testID,
  children,
  style,
  isSelected = true,
  type = 'neutral',
  size = 'medium',
  useI18n,
  disabled,
  onPress,
  icon,
  onPressIcon,
}: PillTabButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  return (
    <TouchableOpacity
      testID={`${testID}-${isSelected ? 'selected' : 'notselected'}`}
      style={[styles.container, isSelected && styles[type], styles[`${size}Padding`], style]}
      disabled={!isInternetReachable || disabled}
      onPress={onPress}
    >
      <Text
        variant={textVariant[size]}
        style={[
          styles.text,
          isSelected ? styles[`${type}Text`] : styles.neutralText,
        ]}
        useI18n={useI18n}
      >
        {children}
      </Text>
      {
        onPressIcon && (
        <Icon
          testID="tag.icon"
          style={styles.icon}
          icon={icon}
          size={12}
          tintColor={theme.colors.neutral80}
          onPress={onPressIcon}
        />
        )
      }
    </TouchableOpacity>
  );
};

export default PillTabButton;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderRadius: borderRadius.pill,
      alignItems: 'center',
      boxShadow: elevation.light.e1,
      flexDirection: 'row',
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
      paddingHorizontal: spacing.padding.base,
    },
    mediumPadding: {
      paddingVertical: spacing.padding.xSmall,
      paddingHorizontal: spacing.padding.base,
    },
    smallPadding: {
      paddingVertical: spacing.padding.xSmall,
      paddingHorizontal: spacing.padding.small,
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
    icon: {
      marginLeft: spacing.margin.tiny,
    },
  });
};

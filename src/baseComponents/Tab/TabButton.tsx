import {
  StyleProp, ViewStyle, TouchableOpacity, StyleSheet,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text, { TextVariant } from '~/baseComponents/Text';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import { spacing } from '~/theme';

export interface TabButtonProps {
  testID?: string;
  children?: string;
  ContentComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
  size?: 'large' | 'medium' | 'small';
  useI18n?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const textVariant = {
  large: 'tabL' as TextVariant,
  medium: 'tabM' as TextVariant,
  small: 'tabS' as TextVariant,
};

const TabButton = ({
  testID,
  children,
  style,
  isSelected = true,
  size = 'medium',
  useI18n,
  disabled,
  ContentComponent,
  onPress,
}: TabButtonProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme, isSelected);
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  return (
    <TouchableOpacity
      testID={`${testID}-${isSelected ? 'selected' : 'notselected'}`}
      style={[styles.container, style]}
      disabled={!isInternetReachable || disabled}
      onPress={onPress}
    >
      {ContentComponent || (
      <Text
        variant={textVariant[size]}
        color={isSelected ? colors.purple50 : colors.neutral40}
        useI18n={useI18n}
      >
        {children}
      </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme, isSelected: boolean) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.padding.base,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: isSelected ? 2 : null,
      borderBottomColor: isSelected ? colors.purple50 : colors.neutral40,
    },
  });
};

export default TabButton;

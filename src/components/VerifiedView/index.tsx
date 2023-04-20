import {
  StyleSheet, StyleProp, ViewStyle, TouchableOpacity,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import useTooltip from '~/components/Tooltip.tsx/stores';

interface Props {
  screenId?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: ()=>void;
  onLayout?: (e: any) => void;
}

const VerifiedView = ({
  screenId,
  size = 14, style = {}, onPress, onLayout,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;
  const tooltipActions = useTooltip((state) => state.actions);

  const _onLayout = (event: any) => {
    if (onPress && !onLayout) {
      tooltipActions.setViewPosition(screenId, { width: event?.nativeEvent?.layout?.width || 0 });
    }
    onLayout?.(event);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      disabled={!onPress}
      onPress={onPress}
      onLayout={_onLayout}
    >
      <Icon
        testID="avatar.badge"
        size={size}
        tintColor={colors.green50}
        icon="BadgeCheck"
      />
    </TouchableOpacity>
  );
};

export default VerifiedView;

const themeStyles = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    marginLeft: spacing.margin.xSmall,
  },
});

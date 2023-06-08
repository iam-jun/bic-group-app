import {
  Platform,
  StatusBar,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Tooltip from 'react-native-walkthrough-tooltip';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface Props {
  isVerified: boolean;
  size?: number;
  disabled?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const VerifiedView = ({
  isVerified,
  size = 14,
  disabled = true,
  placement = 'top',
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;
  const containerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  if (!isVerified) return null;

  return (
    <>
      <ViewSpacing width={spacing.margin.xSmall} />
      <Tooltip
        isVisible={isVisible}
        disableShadow
        displayInsets={{
          top: spacing.margin.large,
          bottom: spacing.margin.large,
          left: spacing.margin.large,
          right: spacing.margin.large,
        }}
        placement={placement}
        contentStyle={styles.tooltipStyle}
        content={(
          <Text.BodyS
            useI18n
            testID="user_profile.tooltip"
            color={colors.white}
          >
            settings:toast_profile_is_verified
          </Text.BodyS>
  )}
        backgroundColor="transparent"
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        onClose={() => { setIsVisible(false); }}
      >
        <TouchableOpacity
          ref={containerRef}
          disabled={disabled}
          onPress={() => { setIsVisible(true); }}
        >
          <Icon
            testID="avatar.badge"
            size={size}
            tintColor={colors.green50}
            icon="BadgeCheck"
          />
        </TouchableOpacity>
      </Tooltip>
    </>
  );
};

export default VerifiedView;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      marginLeft: spacing.margin.xSmall,
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.small,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

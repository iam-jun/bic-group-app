import React, { useState } from 'react';
import {
  TouchableOpacity, StyleSheet, Platform, StatusBar, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';

import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface Props {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onPress?: () => void;
}

const UserBadgePlaceHolderItem = ({
  placement = 'top',
  onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const [isVisible, setIsVisible] = useState(false);

  return (
    <Tooltip
      isVisible={Boolean(isVisible)}
      content={(
        <View style={styles.row}>
          <ViewSpacing width={spacing.margin.small} />
          <Text.SubtitleS color={colors.white} useI18n>user:badge_tooltip_placeholder</Text.SubtitleS>
          <ViewSpacing width={spacing.margin.small} />
        </View>
          )}
      placement={placement}
      backgroundColor="transparent"
      contentStyle={styles.tooltipStyle}
      disableShadow
      topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      onClose={() => setIsVisible(false)}
    >
      <TouchableOpacity
        testID="user_badge_item.empty"
        style={styles.emptyItem}
        onLongPress={() => setIsVisible(true)}
        onPress={onPress}
      >
        <Icon
          size={28}
          icon="CirclePlus"
          tintColor={theme.colors.neutral20}
        />
      </TouchableOpacity>
    </Tooltip>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    emptyItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainerStyle: {
      alignItems: 'center',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.xSmall,
    },
    row: { flexDirection: 'row' },
  });
};

export default UserBadgePlaceHolderItem;

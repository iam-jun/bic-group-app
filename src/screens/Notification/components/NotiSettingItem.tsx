import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing from '~/theme/spacing';
import { Toggle } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import { INotiSettings } from '~/interfaces/INotification';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { IconType } from '~/resources/icons';

interface NotiSettingItemProps {
    item: INotiSettings;
    iconName: IconType;
    isDisable?: boolean;
    isDisableToggle?: boolean;
    isShowSubTitle?: boolean;
    onPressToggle?: (isChecked: boolean) => void;
    onPress?: (item: INotiSettings) => void;
}

const NotiSettingItem = ({
  item,
  iconName,
  isDisable = false,
  isDisableToggle = false,
  isShowSubTitle = false,
  onPressToggle,
  onPress,
}: NotiSettingItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  if (!Boolean(item)) {
    return null;
  }
  const { title, enable, subtitle = '' } = item;
  const disable = Boolean(isDisable);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, styles.row]}
      disabled={disable || isDisableToggle}
      onPress={() => onPress?.(item)}
    >
      <View style={[styles.row, styles.flex1, styles.textContainer]}>
        <Icon tintColor={disable ? colors.neutral30 : colors.neutral40} size={18} icon={iconName} />
        <ViewSpacing width={spacing.margin.large} />
        <View>
          <Text.BodyMMedium color={disable ? colors.neutral30 : colors.neutral80}>
            {title}
          </Text.BodyMMedium>
          {Boolean(isShowSubTitle) && Boolean(subtitle) && (
          <Text.BodyS style={styles.subTitle}>
            {subtitle}
          </Text.BodyS>
          )}
        </View>
      </View>
      <ViewSpacing width={spacing.margin.large} />
      {Boolean(onPressToggle)
        ? (
          <Toggle
            isChecked={enable}
            disabled={isDisableToggle}
            onValueChanged={onPressToggle}
          />
        ) : <Icon tintColor={disable ? colors.neutral30 : colors.neutral40} size={14} icon="ChevronRight" />}
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: { paddingRight: spacing.padding.large },
    subTitle: {
      flexShrink: 1,
      marginRight: spacing.margin.large,
    },
  });
};

export default NotiSettingItem;

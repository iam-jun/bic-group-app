import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { IGroup } from '~/interfaces/IGroup';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { Avatar, Button } from '~/baseComponents';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';
import useBaseHook from '~/hooks/baseHook';
import { IAdvancedNotificationSettings } from '~/interfaces/INotification';

interface Props {
    item: IGroup;
    isDisabled?: boolean;
    onPress: (item: IGroup) => void;
}

const AdvancedSettingItem = ({ item, isDisabled = false, onPress }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  const isLoading = useAdvancedNotiSettingsStore((state) => state.isLoadingGroupSettings);
  const groupData = useAdvancedNotiSettingsStore((state) => state.groupData?.[item.id]);

  const getLabelText = (item: IAdvancedNotificationSettings) => {
    if (isEmpty(item)) return '';
    const { flag, channels, enable } = item;
    if (enable && flag?.value) {
      if (channels?.inApp && channels?.push) {
        return `${t('notification:notification_settings:in_app_text')}, ${t('notification:notification_settings:push_text')}`;
      }
      if (channels?.inApp) {
        return t('notification:notification_settings:in_app_text');
      }
      if (channels?.push) {
        return t('notification:notification_settings:push_text');
      }
    } else if (!flag?.value) {
      return t('notification:notification_settings:default_text');
    } else {
      return t('notification:notification_settings:off_text');
    }
  };

  const label = getLabelText(groupData);

  const onPressItem = () => onPress(item);

  if (isEmpty(item)) return null;
  const { icon, name, privacy } = item;
  const privacyIcon = GroupPrivacyDetail[privacy]?.icon as IconType;
  return (
    <Button
      testID="notification_advanced_setting_item"
      disabled={isDisabled}
      activeOpacity={0.85}
      style={styles.container}
      onPress={onPressItem}
    >
      {Boolean(isDisabled)
      && <View testID="notification_advanced_setting_item.disable_view" style={styles.disable} />}
      <Avatar.Base source={icon} privacyIcon={privacyIcon} />
      <ViewSpacing width={spacing.margin.small} />
      <View style={styles.flex1}>
        <Text.BodyMMedium
          testID="notification_advanced_setting_item.name"
          color={colors.neutral60}
          numberOfLines={2}
        >
          {name}
        </Text.BodyMMedium>
        {
          Boolean(isLoading)
            ? <Animated.View style={[styles.labelSkeleton, animatedStyle]} />
            : (
              <Text.BadgeM
                testID="notification_advanced_setting_item.label"
                color={colors.neutral40}
              >
                {label}
              </Text.BadgeM>
            )
        }
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.white,
    },
    labelSkeleton: {
      width: 80,
      height: 12,
    },
    flex1: {
      flex: 1,
    },
    disable: {
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.white,
      opacity: 0.6,
    },
  });
};

export default AdvancedSettingItem;

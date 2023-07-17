import React, { FC, useState } from 'react';
import {
  Platform, RefreshControl, StatusBar, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { debounce } from 'lodash';
import Tooltip from 'react-native-walkthrough-tooltip';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import { IRouteParams } from '~/interfaces/IRouter';
import Text from '~/baseComponents/Text';
import NotiSettingItem from '../components/NotiSettingItem';
import { INotiChannel, INotiSettings } from '~/interfaces/INotification';
import useAdvancedNotiSettingsStore from './store';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import Icon from '~/baseComponents/Icon';
import Divider from '~/beinComponents/Divider';

const topAdjustment = Platform.OS === 'android' ? -StatusBar.currentHeight + 3 : 0;

const AdvancedSettingsDetail: FC<IRouteParams> = (props) => {
  const { name, groupId } = props?.route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);

  const data = useAdvancedNotiSettingsStore((state) => state.groupData?.[groupId]);
  const actions = useAdvancedNotiSettingsStore((state) => state.actions);
  const isRefreshing = useAdvancedNotiSettingsStore((state) => state.isRefreshing);
  const isUpdatting = useAdvancedNotiSettingsStore((state) => state.isUpdatingGroupSettings);

  const { channels = {}, enable = true, flag } = data;

  const isDefault = !Boolean(flag?.value) && enable;
  const isDisableItemAllowAll = isDefault;
  const isDisableItem = isDisableItemAllowAll || !enable;

  const onRefresh = () => {
    actions.getGroupSettings([groupId]);
  };

  const onChangeToggleAllowAll = (isChecked :boolean) => {
    const newChannels = {
      inApp: isChecked ? true : channels?.inApp,
      push: isChecked ? true : channels?.push,
    };
    const payload = { enable: isChecked, channels: newChannels };
    const dataUpdateStore:any = { ...data, channels: newChannels, enable: isChecked };
    actions.updateGroupSettings(payload, dataUpdateStore);
  };

  const handlePressItemInApp = debounce((isChecked :boolean) => {
    const newEnable = Boolean(isChecked || channels?.push);
    const payload = {
      channels:
        {
          inApp: isChecked,
        },
      enable: newEnable,
    };
    const dataUpdateStore: any = {
      ...data,
      channels:
        {
          inApp: isChecked,
          push: channels?.push,
        },
      enable: newEnable,
    };
    actions.updateGroupSettings(payload, dataUpdateStore);
  }, 100);

  const handlePressItemPush = debounce((isChecked :boolean) => {
    const newEnable = Boolean(isChecked || channels?.inApp);
    const payload = {
      channels:
        {
          push: isChecked,
        },
      enable: newEnable,
    };
    const dataUpdateStore: any = {
      ...data,
      channels:
        {
          inApp: channels?.inApp,
          push: isChecked,
        },
      enable: newEnable,
    };
    actions.updateGroupSettings(payload, dataUpdateStore);
  }, 100);

  const onResetConfig = () => {
    const newData = { enable: true, channels: { inApp: true, push: true } };
    // apply default config
    if (isDefault) {
      const payload:any = { flag: true, ...newData };
      const dataUpdateStore:any = {
        ...data,
        ...newData,
        flag: {
          label: 'Default',
          value: true,
        },
      };
      actions.updateGroupSettings(payload, dataUpdateStore);
      return;
    }
    // reset to default (not config)
    const payload:any = { flag: false, ...newData };
    const dataUpdateStore:any = {
      ...data,
      ...newData,
      flag: {
        label: 'Default',
        value: false,
      },
    };
    actions.updateGroupSettings(payload, dataUpdateStore);
  };

  const _setIsVisibleTooltip = () => {
    setIsVisibleTooltip(!isVisibleTooltip);
  };

  if (!Boolean(data)) return null;

  const defaultItem: INotiSettings = {
    title: t('notification:notification_settings:allow_notifications'),
    enable,
    name,
    order: 0,
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.BodyS useI18n color={colors.neutral40}>
        notification:advanced_notifications_settings:description_setup_group
      </Text.BodyS>
    </View>
  );

  const renderChildContent = (
    { inApp = true, push = true }: INotiChannel,
  ) => {
    const inAppItem: INotiSettings = {
      title: t('notification:notification_settings:in_app_text'),
      enable: inApp,
      name: 'inApp',
      order: 1,
    };
    const pushItem: INotiSettings = {
      title: t('notification:notification_settings:push_text'),
      enable: push,
      name: 'inApp',
      order: 2,
    };

    return (
      <>
        <NotiSettingItem
          item={inAppItem}
          isDisable={isDisableItem}
          isDisableToggle={isDisableItem}
          iconName="Grid2"
          onPressToggle={handlePressItemInApp}
        />
        <NotiSettingItem
          item={pushItem}
          isDisable={isDisableItem}
          isDisableToggle={isDisableItem}
          iconName="Window"
          onPressToggle={handlePressItemPush}
        />
      </>
    );
  };

  const buttonText = isDefault ? t('notification:advanced_notifications_settings:text_enable_settings')
    : t('notification:advanced_notifications_settings:title_reset_to_default');
  const tooltipText = isDefault ? t('notification:advanced_notifications_settings:reset_to_default_tooltip')
    : t('notification:advanced_notifications_settings:enable_settings_tooltip');

  const renderContentTooltip = () => (
    <Text.BodyM color={colors.white}>
      {tooltipText}
    </Text.BodyM>
  );

  return (
    <ScreenWrapper
      testID="notification_settings"
      isFullView
      backgroundColor={colors.gray5}
    >
      {Boolean(name)
      && <Header title={name} />}
      <ViewSpacing height={spacing.padding.large} />
      <Animated.ScrollView
        style={styles.flex1}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
          )}
      >
        {renderHeader()}
        <NotiSettingItem
          item={defaultItem}
          isDisable={isDisableItemAllowAll}
          isDisableToggle={isDisableItemAllowAll}
          iconName="Bell"
          onPressToggle={onChangeToggleAllowAll}
        />
        {Boolean(channels) && renderChildContent(channels)}
        <View style={styles.wrapperContainer}>
          <View style={styles.groupButtonContainer}>
            <Tooltip
              isVisible={isVisibleTooltip}
              disableShadow
              childContentSpacing={3}
              placement="top"
              contentStyle={styles.tooltipStyle}
              content={renderContentTooltip()}
              backgroundColor="transparent"
              topAdjustment={topAdjustment}
              displayInsets={{
                top: spacing.margin.large,
                bottom: spacing.margin.large,
                left: spacing.margin.large,
                right: spacing.margin.large,
              }}
              onClose={_setIsVisibleTooltip}
            >
              <View style={styles.row}>
                <ButtonWrapper disabled={isUpdatting} style={styles.buttonWrapper} onPress={onResetConfig}>
                  <Text.ButtonM color={isUpdatting ? colors.neutral20 : colors.neutral60}>
                    {buttonText}
                  </Text.ButtonM>
                </ButtonWrapper>
                <Divider horizontal size={1} />
                <ButtonWrapper style={styles.buttonInfoWrapper} onPress={_setIsVisibleTooltip}>
                  <Icon icon="CircleQuestion" size={16} color={colors.neutral40} />
                </ButtonWrapper>
              </View>
            </Tooltip>
          </View>
        </View>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    childContainer: {
      marginTop: spacing.margin.large,
      backgroundColor: colors.white,
    },
    childHeader: {
      marginTop: spacing.margin.large,
      marginLeft: spacing.margin.large,
    },
    wrapperContainer: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    groupButtonContainer: {
      alignSelf: 'flex-start',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.small,
      borderRadius: spacing.borderRadius.base,
      backgroundColor: colors.neutral2,
    },
    buttonWrapper: {
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.neutral2,
    },
    buttonInfoWrapper: {
      paddingHorizontal: spacing.padding.base - spacing.padding.xTiny,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      width: 200,
    },
  });
};

export default AdvancedSettingsDetail;

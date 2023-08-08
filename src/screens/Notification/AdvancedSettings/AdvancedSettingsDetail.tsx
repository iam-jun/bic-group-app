import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
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

const topAdjustment = Platform.OS === 'android' ? -StatusBar.currentHeight : 0;
const defaultData = { enable: true, channels: { inApp: true, push: true } };

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
  const isUpdatting = useAdvancedNotiSettingsStore((state) => state.isResetOrEnableGroupSettings);

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
    // apply default config
    if (isDefault) {
      const payload:any = { flag: true, ...defaultData };
      const dataUpdateStore:any = {
        ...data,
        ...defaultData,
        flag: {
          value: true,
        },
      };
      actions.updateGroupSettings(payload, dataUpdateStore, true);
      return;
    }
    // reset to default (not config)
    const payload:any = { flag: false, ...defaultData };
    const dataUpdateStore:any = {
      ...data,
      ...defaultData,
      flag: {
        value: false,
      },
    };
    actions.updateGroupSettings(payload, dataUpdateStore, true);
  };

  const updateIsVisibleTooltip = () => {
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

  const renderContentTooltip = () => {
    const tooltipText = isDefault ? t('notification:advanced_notifications_settings:enable_settings_tooltip')
      : t('notification:advanced_notifications_settings:reset_to_default_tooltip');
    return (
      <Text.BodyM color={colors.white}>
        {tooltipText}
      </Text.BodyM>
    );
  };

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
              key={`advanced_settinsg.tooltip_${buttonText}`}
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
              onClose={updateIsVisibleTooltip}
            >
              <View style={[styles.row, styles.buttonGroup, isDefault ? styles.primaryButton : styles.defaultButton]}>
                <ButtonWrapper
                  disabled={isUpdatting}
                  style={[styles.buttonWrapper, styles.row]}
                  onPress={onResetConfig}
                >
                  {
                    isUpdatting && (
                    <ActivityIndicator
                      testID="button.loading"
                      color={isDefault ? colors.purple50 : colors.neutral60}
                      style={styles.loading}
                      size={18}
                    />
                    )
                  }
                  <Text.ButtonM color={isDefault ? colors.purple50 : colors.neutral60}>
                    { buttonText}
                  </Text.ButtonM>
                </ButtonWrapper>
                <Divider horizontal size={1} color={isDefault ? colors.purple5 : colors.neutral5} />
                <ButtonWrapper
                  disabled={isUpdatting}
                  style={styles.buttonInfoWrapper}
                  onPress={updateIsVisibleTooltip}
                >
                  <Icon
                    icon="CircleQuestion"
                    size={16}
                    tintColor={isDefault ? colors.purple50 : colors.neutral60}
                  />
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
    },
    buttonGroup: {
      borderRadius: spacing.borderRadius.base,
      overflow: 'hidden',
    },
    buttonWrapper: {
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.neutral2,
      paddingVertical: spacing.padding.small,
    },
    buttonInfoWrapper: {
      paddingHorizontal: spacing.padding.base - spacing.padding.xTiny,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      maxWidth: 250,
    },
    defaultButton: {
      backgroundColor: colors.neutral2,
    },
    primaryButton: {
      backgroundColor: colors.purple2,
    },
    loading: {
      marginRight: spacing.margin.small,
    },
  });
};

export default AdvancedSettingsDetail;

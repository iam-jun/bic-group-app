import React, { FC } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { capitalize, debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import { IRouteParams } from '~/interfaces/IRouter';
import useNotiSettingsStore from './store';
import Text from '~/baseComponents/Text';
import NotiSettingItem from '../components/NotiSettingItem';
import { INotiChannel, INotiSettings } from '~/interfaces/INotification';
import { trackEvent } from '~/services/tracking';

interface IHandleToggleProps {
  isChecked: boolean;
  item: INotiSettings;
  index: number;
}

interface IHandleUpdateSettings {
  payload: INotiSettings;
  oldPayload: INotiSettings;
  index: number;
}

const icons = {
  email_important_content: 'Star',
  email_content_mentions: 'At',
};

const NotiSettingDetail: FC<IRouteParams> = (props) => {
  const { name } = props?.route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const data = useNotiSettingsStore((state) => state.data?.[name]);
  const actions = useNotiSettingsStore((state) => state.actions);
  const isRefreshing = useNotiSettingsStore((state) => state.isRefreshing);

  const {
    title = '', subtitle = '', enable, child = [], channels = undefined,
  } = data;

  const onRefresh = () => {
    actions.getConfigSettings(true);
  };

  const handleUpdateSettings = ({ payload, oldPayload, index }:IHandleUpdateSettings) => {
    let payloadUpdateStore: INotiSettings = {
      name: payload.name,
    };
    if (oldPayload?.enable !== undefined) {
      payloadUpdateStore = { ...payloadUpdateStore, enable: oldPayload.enable };
    }
    if (oldPayload?.channels !== undefined) {
      payloadUpdateStore = { ...payloadUpdateStore, channels: oldPayload.channels };
    }

    if (index !== -1) {
      const newChild = child?.map((item: INotiSettings, i: number) => {
        if (i === index) {
          return oldPayload;
        }
        return item;
      });
      const newData = { ...data, child: newChild };
      actions.updateSettings(payload, newData);
    } else {
      actions.updateSettings(payload, payloadUpdateStore);
    }
  };

  const onPressToggle = ({ index, item, isChecked }:IHandleToggleProps) => {
    const payload = { ...item, enable: isChecked };
    const oldPayload = { ...item, enable: isChecked };
    handleUpdateSettings({ payload, oldPayload, index });
    if (index === -1) {
      trackEvent({
        event: `${capitalize(name)} Noti Changed`,
        sendWithUserId: true,
        properties: { state: isChecked },
      });
    }
  };

  const handlePressItemInApp = debounce(({ index, item, isChecked }:IHandleToggleProps) => {
    const payload = {
      name: item.name,
      channels:
        {
          inApp: isChecked,
        },
    };
    const oldPayload = {
      ...item,
      channels:
        {
          inApp: isChecked,
          push: item?.channels?.push,
        },
    };

    handleUpdateSettings({ payload, oldPayload, index });
  }, 100);

  const handlePressItemPush = debounce(({ index, item, isChecked }:IHandleToggleProps) => {
    const payload = {
      name: item.name,
      channels:
        {
          push: isChecked,
        },
    };
    const oldPayload = {
      ...item,
      channels:
        {
          push: isChecked,
          inApp: item?.channels?.inApp,
        },
    };
    handleUpdateSettings({ payload, oldPayload, index });
  }, 100);

  if (!Boolean(data)) return null;

  const defaultItem: INotiSettings = {
    title: t('notification:notification_settings:allow_notifications'),
    enable,
    name,
    order: 0,
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.BodyS
        testID="notification_settings_detail.sub_title"
      >
        {subtitle}
      </Text.BodyS>
    </View>
  );

  const renderChildContent = (
    { inApp = true, push = true }: INotiChannel,
    item: INotiSettings,
    index: number,
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
          isDisable={!Boolean(enable)}
          isDisableToggle={!Boolean(enable)}
          iconName="Grid2"
          onPressToggle={(isChecked: boolean) => handlePressItemInApp({ isChecked, item, index })}
        />
        <NotiSettingItem
          item={pushItem}
          isDisable={!Boolean(enable)}
          isDisableToggle={!Boolean(enable)}
          iconName="Window"
          onPressToggle={(isChecked: boolean) => handlePressItemPush({ isChecked, item, index })}
        />
      </>
    );
  };

  const renderChild = (item: INotiSettings, index: number) => {
    const { channels: itemChannels = undefined, title } = item;
    if (!Boolean(itemChannels)) {
      const iconName = icons?.[item.name] || 'Bell';
      return (
        <NotiSettingItem
          key={`child_noti_setting_item_${item.name}`}
          item={item}
          iconName={iconName}
          isShowSubTitle
          isDisable={!Boolean(enable)}
          isDisableToggle={!Boolean(enable)}
          onPressToggle={(isChecked: boolean) => onPressToggle({ isChecked, item, index })}
        />
      );
    }
    return (
      <View key={item.name} style={styles.childContainer}>
        <Text.BodyMMedium
          testID="notification_settings_detail.child.title"
          color={!Boolean(enable) ? colors.neutral30 : colors.neutral80}
          style={styles.childHeader}
        >
          {title}
        </Text.BodyMMedium>
        {Boolean(itemChannels) && renderChildContent(itemChannels, item, index)}
      </View>
    );
  };

  return (
    <ScreenWrapper
      testID="notification_settings"
      isFullView
      backgroundColor={colors.gray5}
    >
      {Boolean(title)
      && <Header title={title} />}
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
          iconName="Bell"
          onPressToggle={(isChecked: boolean) => onPressToggle({ isChecked, item: data, index: -1 })}
        />
        {child?.length > 0 && child.map((item: INotiSettings, index: number) => renderChild(item, index))}
        {Boolean(channels) && renderChildContent(channels, data, -1)}
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
  });
};

export default NotiSettingDetail;

import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import { IRouteParams } from '~/interfaces/IRouter';
import useNotiSettingsStore from './store';
import Text from '~/baseComponents/Text';
import NotiSettingItem from '../components/NotiSettingItem';
import { IEditNotificationSetting, INotiChannel, INotiSettings } from '~/interfaces/INotification';

interface HandleToggleProps {
  isChecked: boolean;
   item: INotiSettings;
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

  const {
    title = '', subtitle = '', enable, child = [], channels = undefined,
  } = data;

  const handleUpdateSettings = (payload: INotiSettings, index: number) => {
    let newPayload: IEditNotificationSetting = {
      name: payload.name,
    };
    if (payload?.enable !== undefined) {
      newPayload = { ...newPayload, enable: payload.enable };
    }
    if (payload?.channels !== undefined) {
      newPayload = { ...newPayload, channels: payload.channels };
    }

    if (index !== -1) {
      const newChild = child?.map((item: INotiSettings, i: number) => {
        if (i === index) {
          return payload;
        }
        return item;
      });
      const newData = { ...data, child: newChild };
      actions.updateSettings(newPayload, newData);
    } else {
      actions.updateSettings(newPayload, payload);
    }
  };

  const onPressToggle = ({ index, item, isChecked }:HandleToggleProps) => {
    const payload = { ...item, enable: isChecked };
    handleUpdateSettings(payload, index);
  };

  const handlePressItemInApp = debounce(({ index, item, isChecked }:HandleToggleProps) => {
    const payload = {
      ...item,
      channels:
        {
          inApp: isChecked,
          push: item?.channels?.push,
        },
    };
    handleUpdateSettings(payload, index);
  }, 100);

  const handlePressItemPush = debounce(({ index, item, isChecked }:HandleToggleProps) => {
    const payload = {
      ...item,
      channels:
        {
          push: isChecked,
          inApp: item?.channels?.inApp,
        },
    };
    handleUpdateSettings(payload, index);
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
      <Text.BodyS>
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
          isDisableToggle={!enable}
          iconName="Grid2"
          onPressToggle={(isChecked: boolean) => handlePressItemInApp({ isChecked, item, index })}
        />
        <NotiSettingItem
          item={pushItem}
          isDisable={!Boolean(enable)}
          isDisableToggle={!enable}
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
          onPressToggle={(isChecked: boolean) => onPressToggle({ isChecked, item, index })}
        />
      );
    }
    return (
      <View key={item.name} style={styles.childContainer}>
        <Text.BodyMMedium color={colors.neutral80} style={styles.childHeader}>
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
      {renderHeader()}
      <NotiSettingItem
        item={defaultItem}
        iconName="Bell"
        onPressToggle={(isChecked: boolean) => onPressToggle({ isChecked, item: data, index: -1 })}
      />
      {child?.length > 0 && child.map((item: INotiSettings, index: number) => renderChild(item, index))}
      {Boolean(channels) && renderChildContent(channels, data, -1)}
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

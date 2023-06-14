import React, { useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import useNotiSettingsStore from './store';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import { Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Divider from '~/beinComponents/Divider';
import NotiSettingItem from '../components/NotiSettingItem';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import { INotiSettings } from '~/interfaces/INotification';

const NotificationSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const actions = useNotiSettingsStore((state) => state.actions);
  const {
    generic = undefined,
    comment = undefined,
    mentions = undefined,
    reaction = undefined,
    email = undefined,
  } = useNotiSettingsStore((state) => state.data);
  const loading = useNotiSettingsStore((state) => state.loading);

  useEffect(() => {
    actions.getConfigSettings();
  }, []);

  const onRefresh = () => {
    actions.getConfigSettings();
  };

  const onPressToggle = (isChecked: boolean) => {
    const payload = { name: generic.name, enable: isChecked };
    const dataUpdate = { ...generic, enable: isChecked };

    actions.updateSettings(payload, dataUpdate);
  };

  const handlePressItem = (item: INotiSettings) => {
    rootNavigation.navigate(notiStack.notiSettingDetail, { name: item?.name });
  };

  const renderEmpty = () => (
    <View style={styles.container}>
      {Boolean(loading) ? <ActivityIndicator size="large" color={colors.neutral1} />
        : (
          <EmptyScreen
            source={images.img_empty_search_post}
            size={100}
            title="notification:notification_settings:error_title"
            description="notification:notification_settings:error_description"
            ButtonComponent={(
              <Button.Primary
                size="medium"
                onPress={onRefresh}
                useI18n
              >
                common:text_refresh
              </Button.Primary>
        )}
          />
        )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.BodyS>
        {t('notification:notification_settings:description')}
      </Text.BodyS>
    </View>
  );

  const renderContainer = () => (
    <>
      {renderHeader()}
      <NotiSettingItem
        item={generic}
        iconName="Bell"
        onPressToggle={onPressToggle}
      />
      <ViewSpacing height={spacing.padding.large} />
      <NotiSettingItem
        isDisable={!Boolean(generic?.enable)}
        item={comment}
        iconName="MessageDots"
        onPress={handlePressItem}
      />
      <Divider color={colors.gray1} />
      <NotiSettingItem
        isDisable={!Boolean(generic?.enable)}
        item={mentions}
        iconName="At"
        onPress={handlePressItem}
      />
      <Divider color={colors.gray1} />
      <NotiSettingItem
        isDisable={!Boolean(generic?.enable)}
        item={reaction}
        iconName="ThumbsUp"
        onPress={handlePressItem}
      />
      <ViewSpacing height={spacing.padding.large} />
      <NotiSettingItem
        isDisable={!Boolean(generic?.enable)}
        item={email}
        iconName="Envelope"
        onPress={handlePressItem}
      />
    </>
  );

  return (
    <ScreenWrapper
      testID="notification_settings"
      isFullView
      backgroundColor={colors.gray5}
    >
      <Header title={t('notification:notification_settings:title')} />
      <ViewSpacing height={spacing.padding.large} />
      {Boolean(generic) && !Boolean(loading)
        ? renderContainer() : renderEmpty()}
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
  });
};

export default NotificationSettings;

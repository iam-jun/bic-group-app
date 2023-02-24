import React from 'react';
import {
  View, StyleSheet, Linking,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/baseComponents/Text';
import useAuthController from '~/screens/auth/store';
import AppVersion from '~/screens/Menu/components/AppVersion';
import CheckUpdate from '~/screens/Menu/components/CheckUpdate';
import { getActions } from '~/store/selectors';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import appActions from '~/storeRedux/app/actions';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';
import { useKeySelector } from '~/hooks/selector';
import { AppConfig } from '~/configs';
import useCommonController from '~/screens/store';
import useModalStore from '~/store/modal';
import { IAlertModal } from '~/interfaces/common';

const REPORT_URL = 'https://report.beincom.com/';

const MenuSettings = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const authActions = useAuthController(getActions) || {};
  const { showAlert } = useModalStore((state) => state.actions);

  const isStaging = getEnv('APP_ENV') === APP_ENV.STAGING;
  const debuggerVisible = useKeySelector('app.debuggerVisible');
  const myProfile = useCommonController((state) => state.myProfile);

  const isShowDebug = __DEV__ || isStaging || AppConfig.superUsers.includes(myProfile?.email);

  const onLogout = () => {
    const alertPayload: IAlertModal = {
      title: t('auth:text_sign_out'),
      content: t('auth:text_sign_out_content'),
      cancelBtn: true,
      onConfirm: authActions.signOut,
      confirmLabel: t('auth:text_sign_out'),
    };
    showAlert(alertPayload);
  };

  const onPressShowDebug = () => {
    dispatch(appActions.setDebuggerVisible(!debuggerVisible));
  };

  const onPressReportProblem = () => {
    Linking.openURL(REPORT_URL);
  };

  const settingItems = [
    {
      icon: 'FolderGear',
      title: t('menu:title_settings_privacy'),
      onPress: () => rootNavigation.navigate(menuStack.accountSettings),
    },
    {
      icon: 'FlagSolid',
      title: t('menu:title_report_problem'),
      onPress: onPressReportProblem,
    },
  ];

  if (isShowDebug) {
    settingItems.push({
      icon: 'MessagesQuestion',
      title: 'Toggle Debug',
      onPress: onPressShowDebug,
    });
  }

  const renderItem = ({ icon, title, onPress }: any) => (
    <Button key={title + icon} style={styles.itemContainer} onPress={onPress} testID={`menu_settings.item_${icon}`}>
      <Icon tintColor={theme.colors.neutral20} icon={icon} />
      <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>{title}</Text.BodyMMedium>
    </Button>
  );

  return (
    <View style={styles.container} testID="menu_settings">
      <View style={styles.row}>
        <Text.SubtitleM style={styles.textHeader} useI18n>menu:title_settings</Text.SubtitleM>
        <AppVersion />
      </View>
      <CheckUpdate />
      {settingItems.map(renderItem)}
      <Button style={styles.itemContainer} onPress={onLogout}>
        <Icon tintColor={theme.colors.purple20} icon="ArrowRightFromBracket" />
        <Text.BodyMMedium style={styles.textLogout} numberOfLines={1}>{t('menu:title_logout')}</Text.BodyMMedium>
      </Button>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textHeader: {
      flex: 1,
      marginBottom: spacing.margin.small,
    },
    textTitle: {
      marginLeft: spacing.margin.large,
      color: colors.neutral40,
    },
    textLogout: {
      marginLeft: spacing.margin.large,
      color: colors.purple50,
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
    },
  });
};

export default MenuSettings;

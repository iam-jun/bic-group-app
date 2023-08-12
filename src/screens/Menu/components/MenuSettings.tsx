import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import useAuthController from '~/screens/auth/store';
import AppVersion from '~/screens/Menu/components/AppVersion';
import { getActions } from '~/store/selectors';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';
import { AppConfig } from '~/configs';
import useCommonController from '~/screens/store';
import useModalStore from '~/store/modal';
import { IAlertModal } from '~/interfaces/common';
import useAppStore from '~/store/app';
import { openInAppBrowser } from '~/utils/link';
import { POLICY_URL } from '~/constants/url';
import AccordionMenu from './AccordionMenu';
import { ISettings, SettingsAndPrivacyType } from '~/interfaces/IMenu';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';

const REPORT_URL = 'https://report.beincom.com/';

const MenuSettings = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const authActions = useAuthController(getActions) || {};
  const { showAlert } = useModalStore((state) => state.actions);

  const isQcEnv = getEnv('APP_ENV') === APP_ENV.STAGING || getEnv('APP_ENV') === APP_ENV.PRERELEASE;
  const debuggerVisible = useAppStore((state) => state.debuggerVisible);
  const appActions = useAppStore((state) => state.actions);

  const myProfile = useCommonController((state) => state.myProfile);

  const isShowDebug = __DEV__ || isQcEnv || AppConfig.superUsers.includes(myProfile?.email);

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
    appActions.setDebuggerVisible(!debuggerVisible);
  };

  const onPressReportProblem = () => {
    Linking.openURL(REPORT_URL);
  };

  const onPressPrivacy = () => {
    openInAppBrowser(POLICY_URL);
  };

  const onPressSettingsAndPrivacy = (type: string) => {
    switch (type) {
      case SettingsAndPrivacyType.SECURITY:
        rootNavigation.navigate(menuStack.securityLogin);
        break;
      case SettingsAndPrivacyType.BLOCKING:
        rootNavigation.navigate(menuStack.blocking);
        break;
      case SettingsAndPrivacyType.PRIVACY:
        rootNavigation.navigate(menuStack.privacyCenter);
        break;
      case SettingsAndPrivacyType.NOTIFICATIONS:
        rootNavigation.navigate(notiStack.notiSettings);
        break;
      default:
        break;
    }
  };

  const settingItems = [
    {
      icon: 'GearSolid',
      title: t('menu:title_settings_privacy'),
      isAccordion: true,
      listAccordion: [
        {
          type: SettingsAndPrivacyType.SECURITY,
          title: 'settings:title_security',
          icon: 'ShieldCheckSolid',
          onPress: () => onPressSettingsAndPrivacy(SettingsAndPrivacyType.SECURITY),
        },
        {
          type: SettingsAndPrivacyType.PRIVACY,
          title: 'settings:privacy_center:menu_item_title',
          icon: 'UnlockSolid',
          onPress: () => onPressSettingsAndPrivacy(SettingsAndPrivacyType.PRIVACY),
        },
        {
          type: SettingsAndPrivacyType.BLOCKING,
          title: 'settings:title_blocking',
          icon: 'UserSlashSolid',
          onPress: () => onPressSettingsAndPrivacy(SettingsAndPrivacyType.BLOCKING),
        },
        {
          type: SettingsAndPrivacyType.NOTIFICATIONS,
          title: 'tabs:notification',
          icon: 'BellSolid',
          onPress: () => onPressSettingsAndPrivacy(SettingsAndPrivacyType.NOTIFICATIONS),
        },
        /**
         * Temporarily hidden language in task BEIN-13338
         */
        // {
        //   type: SettingsAndPrivacyType.LANGUAGE,
        //   title: 'settings:title_language',
        //   icon: 'GlobeSolid',
        //   rightSubTitle: 'settings:app_language',
        //   rightSubIcon: 'AngleRightSolid',
        //   onPress: () => onPressSettingsAndPrivacy(SettingsAndPrivacyType.LANGUAGE),
        // },
      ],
    },
    {
      icon: 'FileLockSolid',
      title: t('menu:title_privacy'),
      onPress: onPressPrivacy,
    },
    {
      icon: 'FlagSolid',
      title: t('menu:title_report_problem'),
      onPress: onPressReportProblem,
    },
  ] as ISettings[];

  if (isShowDebug) {
    settingItems.push({
      icon: 'MessagesQuestion',
      title: 'Toggle Debug',
      onPress: onPressShowDebug,
    });
  }

  const renderItem = ({
    icon, title, onPress, isAccordion = false, listAccordion = [],
  }: any) => {
    if (isAccordion) {
      return (
        <AccordionMenu
          testID="menu_setting.item"
          key={title + icon}
          icon={icon}
          title={title}
          listAccordion={listAccordion}
        />
      );
    }
    return (
      <Button testID="menu_setting.item" key={title + icon} style={styles.itemContainer} onPress={onPress}>
        <Icon tintColor={theme.colors.neutral20} size={22} icon={icon} />
        <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>
          {title}
        </Text.BodyMMedium>
      </Button>
    );
  };

  return (
    <View style={styles.container} testID="menu_settings">
      {settingItems.map(renderItem)}
      <Button testID="menu_setting.logout" style={[styles.itemContainer, styles.itemLogout]} onPress={onLogout}>
        <Icon tintColor={theme.colors.neutral20} size={22} icon="ArrowRightFromBracket" />
        <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>
          {t('menu:title_logout')}
        </Text.BodyMMedium>
      </Button>
      <AppVersion />
      <Text.BodyS style={styles.testingLabel} color={colors.neutral30} useI18n>
        common:text_developing_version
      </Text.BodyS>
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
    textTitle: {
      marginLeft: spacing.margin.large,
      color: colors.neutral40,
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
    },
    itemLogout: {
      marginBottom: spacing.margin.small,
    },
    testingLabel: {
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.large,
    },
  });
};

export default MenuSettings;

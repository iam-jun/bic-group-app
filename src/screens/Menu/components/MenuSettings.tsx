import React from 'react';
import {
  View, StyleSheet,
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
import modalActions from '~/storeRedux/modal/actions';
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

const MenuSettings = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const authActions = useAuthController(getActions) || {};
  const { showAlert } = useModalStore((state) => state.actions);

  const isProduction = getEnv('APP_ENV') === APP_ENV.PRODUCTION;
  const debuggerVisible = useKeySelector('app.debuggerVisible');
  const myProfile = useCommonController((state) => state.myProfile);

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

  const onPressHelp = () => {
    const isSuperUser = AppConfig.superUsers.includes(myProfile?.email);
    if (isProduction && !isSuperUser) {
      dispatch(modalActions.showAlertNewFeature());
    } else {
      dispatch(appActions.setDebuggerVisible(!debuggerVisible));
    }
  };

  const settingItems = [
    {
      icon: 'BrightnessSolid',
      title: t('menu:title_display_accessibility'),
      onPress: () => dispatch(modalActions.showAlertNewFeature()),
    },
    {
      icon: 'FolderGear',
      title: t('menu:title_settings_privacy'),
      onPress: () => rootNavigation.navigate(menuStack.accountSettings),
    },
    {
      icon: 'CreditCardSolid',
      title: t('menu:title_billing_payment'),
      onPress: () => dispatch(modalActions.showAlertNewFeature()),
    },
    {
      icon: 'MessagesQuestion',
      title: t('menu:title_help_support'),
      onPress: onPressHelp,
    },
  ];

  const renderItem = ({ icon, title, onPress }: any) => (
    <Button key={title + icon} style={styles.itemContainer} onPress={onPress}>
      <Icon tintColor={theme.colors.neutral20} icon={icon} />
      <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>{title}</Text.BodyMMedium>
    </Button>
  );

  return (
    <View style={styles.container}>
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

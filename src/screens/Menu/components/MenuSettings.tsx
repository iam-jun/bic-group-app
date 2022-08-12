import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import modalActions from '~/store/modal/actions';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import authActions from '~/screens/Auth/redux/actions';
import getEnv from '~/utils/env';

const MenuSettings = () => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const onLogout = () => {
    const alertPayload = {
      title: t('auth:text_sign_out'),
      content: 'Do you want to Log Out?',
      iconName: 'ArrowRightFromArc',
      cancelBtn: true,
      onConfirm: () => dispatch(authActions.signOut()),
      confirmLabel: t('auth:text_sign_out'),
    };
    dispatch(modalActions.showAlert(alertPayload))
  }

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
      onPress: () => dispatch(modalActions.showAlertNewFeature()),
    },
  ]

  const renderItem = ({ icon, title, onPress }: any) => (
    <Button key={title + icon} style={styles.itemContainer} onPress={onPress}>
      <Icon tintColor={theme.colors.neutral20} icon={icon} />
      <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>{title}</Text.BodyMMedium>
    </Button>
  )

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text.SubtitleM style={styles.textHeader} useI18n>menu:title_settings</Text.SubtitleM>
        <Text.SubtitleXS>{getEnv('APP_VERSION')}</Text.SubtitleXS>
      </View>
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

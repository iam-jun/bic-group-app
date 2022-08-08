import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

const MenuSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const settingItems = [
    // { icon: '', title: '', onPress: () => {} },
  ]

  return (
    <View style={styles.container}>
      <Text.SubtitleM useI18n>menu:title_settings</Text.SubtitleM>
    </View>
  );
};

//     case 'accountSettings':
//       return rootNavigation.navigate(menuStack.accountSettings);
//
//     case 'logOut': {
//       const alertPayload = {
//         title: i18next.t('auth:text_sign_out'),
//         content: 'Do you want to Log Out?',
//         iconName: 'ArrowRightFromArc',
//         cancelBtn: true,
//         onConfirm: () => dispatch(authActions.signOut()),
//         confirmLabel: i18next.t('auth:text_sign_out'),
//       };
//       dispatch(modalActions.showAlert(alertPayload));
//       break;
//     }

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default MenuSettings;

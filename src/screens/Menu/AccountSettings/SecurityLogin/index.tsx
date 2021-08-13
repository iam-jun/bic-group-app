import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import {useBaseHook} from '~/hooks';
import * as modalActions from '~/store/modal/actions';

import {ISetting} from '~/interfaces/common';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {securityLoginMenu} from '~/constants/settings';
import {ITheme} from '~/theme/interfaces';

const SecurityLogin = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const onSecurityLoginPress = (item: ISetting) => {
    switch (item.type) {
      case 'changePassword':
        dispatch(
          modalActions.showAlert({
            title: 'Change password',
            content: 'Nothing to look here 😏😏😏',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
        return;

      default:
        dispatch(
          modalActions.showAlert({
            title: 'Info',
            content:
              'Function has not been developed. Stay tuned for further releases 😀',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
    }
  };

  return (
    <ScreenWrapper testID="SecurityAndLogin" isFullView>
      <Header title={t('settings:title_security_login')} />
      <ListView
        type="menu"
        data={securityLoginMenu.password}
        scrollEnabled={false}
        onItemPress={onSecurityLoginPress}
      />
      <Divider style={styles.divider} />
      <ListView
        type="menu"
        data={securityLoginMenu.security}
        scrollEnabled={false}
        onItemPress={onSecurityLoginPress}
      />
    </ScreenWrapper>
  );
};

export default SecurityLogin;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    divider: {
      marginVertical: spacing.margin.small,
    },
  });
};

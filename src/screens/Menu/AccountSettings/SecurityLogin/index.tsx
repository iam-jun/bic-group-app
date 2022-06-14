import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {useBaseHook} from '~/hooks';
import * as modalActions from '~/store/modal/actions';

import {ISetting} from '~/interfaces/common';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {securityLoginMenu} from '~/constants/settings';
import {ITheme} from '~/theme/interfaces';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';

const SecurityLogin = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const onSecurityLoginPress = (item: ISetting) => {
    switch (item.type) {
      case 'changePassword':
        return navigation.navigate(menuStack.changePassword);

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_security_login')} />
      <ListView
        type="menu"
        itemTestID="security_login"
        data={securityLoginMenu.password}
        scrollEnabled={false}
        onItemPress={onSecurityLoginPress}
        style={styles.firstMenuGroup}
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
    firstMenuGroup: {
      marginTop: spacing.margin.base,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
  });
};

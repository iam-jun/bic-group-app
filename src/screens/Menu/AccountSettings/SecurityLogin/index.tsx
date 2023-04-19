import React from 'react';
import { StyleSheet } from 'react-native';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';

import { ISetting } from '~/interfaces/common';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import spacing from '~/theme/spacing';
import { securityLoginMenu } from './constants';

const SecurityLogin = () => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const onSecurityLoginPress = (item: ISetting) => {
    switch (item.type) {
      case 'changePassword':
        return rootNavigation.navigate(menuStack.changePassword);
    }
  };

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_security')} />
      <ListView
        type="menu"
        itemTestID="security_login"
        data={securityLoginMenu.password}
        scrollEnabled={false}
        onItemPress={onSecurityLoginPress}
        style={styles.firstMenuGroup}
      />
    </ScreenWrapper>
  );
};

export default SecurityLogin;

const styles = StyleSheet.create({
  firstMenuGroup: {
    marginTop: spacing.margin.base,
  },
  divider: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.small,
  },
});

import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {accountSettingsMenu} from '~/constants/settings';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {ISetting} from '~/interfaces/common';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import AlertModal from '~/beinComponents/modals/AlertModal';
import mainStack from '~/router/navigator/MainStack/stack';

const GeneralSettings = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const onAccountSettingsPress = (item: ISetting) => {
    switch (item.type) {
      case 'userProfile':
        return rootNavigation.navigate(mainStack.userProfile);

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
    <ScreenWrapper testID="AccountSettings" style={styles.container} isFullView>
      <Header title={t('settings:title_account_settings')} />
      <ListView
        type="menu"
        data={accountSettingsMenu}
        scrollEnabled={false}
        listStyle={styles.list}
        onItemPress={onAccountSettingsPress}
      />
      <AlertModal />
    </ScreenWrapper>
  );
};

export default GeneralSettings;

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {},
    list: {
      marginTop: spacing.margin.base,
    },
  });
};

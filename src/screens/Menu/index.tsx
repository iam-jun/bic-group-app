import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ISetting} from '~/interfaces/common';
import useAuth from '~/hooks/auth';
import {useBaseHook} from '~/hooks';
import * as authActions from '~/screens/Auth/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import settings, {
  appSettingsMenu,
  documentsMenu,
  logoutMenu,
} from '~/constants/settings';
import * as modalActions from '~/store/modal/actions';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ListView from '~/beinComponents/list/ListView';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import {ITheme} from '~/theme/interfaces';
import mainStack from '~/router/navigator/MainStack/stack';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const {user} = useAuth();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const onSettingPress = (item: ISetting) => {
    switch (item.type) {
      case 'accountSettings':
        return rootNavigation.navigate(mainStack.accountSettings);

      case 'component':
        return rootNavigation.navigate(menuStack.componentCollection);

      case 'logOut':
        dispatch(
          modalActions.showAlert({
            title: t('auth:text_sign_out'),
            content: 'Do you want to Log Out?',
            iconName: 'SignOutAlt',
            cancelBtn: true,
            onConfirm: () => dispatch(authActions.signOut()),
            confirmLabel: t('auth:text_sign_out'),
          }),
        );
        break;

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
    <ScreenWrapper testID="DrawerComponent" style={styles.container} isFullView>
      <Header hideBack title={'Menu'} />
      <HeaderAvatarView
        firstLabel={user?.name}
        secondLabel={user?.email}
        avatar={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
        containerStyle={styles.header}
      />
      <ViewSpacing height={theme.spacing.margin.large} />

      <ListView
        type="menu"
        data={appSettingsMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />
      <Divider size={10} style={styles.divider} />
      <ListView
        type="menu"
        data={documentsMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />

      <Divider size={10} style={styles.divider} />
      <ListView
        type="menu"
        data={logoutMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />

      <Divider size={10} style={styles.divider} />
      {/* TODO: Will remove this setting section */}
      <ListView
        scrollEnabled={false}
        type="menu"
        data={settings}
        onItemPress={onSettingPress}
      />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    header: {
      marginHorizontal: spacing.margin.small,
      marginTop: spacing.margin.large,
    },
    divider: {},
  });
};

export default Menu;

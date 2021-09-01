import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import settings, {
  appSettingsMenu,
  documentsMenu,
  logoutMenu,
} from '~/constants/settings';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import useMenu from '~/hooks/menu';
import {useRootNavigation} from '~/hooks/navigation';
import {ISetting} from '~/interfaces/common';
import images from '~/resources/images';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import * as authActions from '~/screens/Auth/redux/actions';
import menuActions from '~/screens/Menu/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {myProfile} = useMenu();
  const {id, fullname, email, avatar} = myProfile;
  const currentUserId = useUserIdAuth();

  useEffect(() => {
    dispatch(menuActions.getMyProfile(currentUserId));
  }, []);

  const onSettingPress = (item: ISetting) => {
    switch (item.type) {
      case 'accountSettings':
        return rootNavigation.navigate(menuStack.accountSettings);

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

  const goToMyProfile = () => {
    dispatch(
      menuActions.selectMyProfile({
        id,
        fullname,
        email,
        avatar,
        isPublic: false,
      }),
    );
    rootNavigation.navigate(menuStack.myProfile);
  };

  return (
    <ScreenWrapper testID="DrawerComponent" style={styles.container} isFullView>
      <Header hideBack title={'Menu'} />
      <HeaderAvatarView
        firstLabel={fullname}
        secondLabel={email}
        avatar={avatar || images.img_user_avatar_default}
        containerStyle={styles.header}
        onPress={goToMyProfile}
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
      {__DEV__ && (
        <ListView
          scrollEnabled={false}
          type="menu"
          data={settings}
          onItemPress={onSettingPress}
        />
      )}
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

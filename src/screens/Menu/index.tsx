import React, {useEffect} from 'react';
import {Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import settings, {
  postFeatureMenu,
  appSettingsMenu,
  documentsMenu,
  logoutMenu,
} from '~/constants/settings';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {ISetting} from '~/interfaces/common';
import images from '~/resources/images';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import * as authActions from '~/screens/Auth/redux/actions';
import menuActions from '~/screens/Menu/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import mainStack from '~/router/navigator/MainStack/stack';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const {id, fullname, email, avatar} =
    useKeySelector(menuKeySelector.myProfile) || {};
  const currentUserId = useUserIdAuth();

  useEffect(() => {
    if (!!currentUserId)
      dispatch(menuActions.getMyProfile({userId: currentUserId}));
  }, []);

  const onSettingPress = (item: ISetting) => {
    switch (item.type) {
      case 'draftPost':
        return rootNavigation.navigate(homeStack.draftPost);

      case 'accountSettings':
        return rootNavigation.navigate(menuStack.accountSettings);

      case 'component':
        return rootNavigation.navigate(menuStack.componentCollection);

      case 'logOut':
        dispatch(
          modalActions.showAlert({
            title: i18next.t('auth:text_sign_out'),
            content: 'Do you want to Log Out?',
            iconName: 'SignOutAlt',
            cancelBtn: true,
            onConfirm: () => dispatch(authActions.signOut()),
            confirmLabel: i18next.t('auth:text_sign_out'),
          }),
        );
        break;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const goToMyProfile = () => {
    rootNavigation.navigate(mainStack.userProfile, {userId: id});
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header
        hideBack
        title="tabs:menus"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={isLaptop}
      />
      <HeaderAvatarView
        firstLabel={fullname}
        secondLabel={email}
        avatar={avatar || images.img_user_avatar_default}
        containerStyle={styles.header}
        onPress={goToMyProfile}
      />
      <ViewSpacing height={theme.spacing.margin.large} />

      {Platform.OS !== 'web' && (
        <>
          <Divider style={styles.divider} />
          <ListView
            itemStyle={styles.itemStyle}
            type="menu"
            data={postFeatureMenu}
            scrollEnabled={false}
            onItemPress={onSettingPress}
          />
        </>
      )}
      <Divider style={styles.divider} />
      <ListView
        itemStyle={styles.itemStyle}
        type="menu"
        data={appSettingsMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />
      <Divider style={styles.divider} />
      <ListView
        itemStyle={styles.itemStyle}
        type="menu"
        data={documentsMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />

      <Divider style={styles.divider} />
      <ListView
        itemStyle={styles.itemStyle}
        type="menu"
        data={logoutMenu}
        scrollEnabled={false}
        onItemPress={onSettingPress}
      />

      {__DEV__ && (
        <>
          <Divider style={styles.divider} />
          <ListView
            itemStyle={styles.itemStyle}
            scrollEnabled={false}
            type="menu"
            data={settings}
            onItemPress={onSettingPress}
          />
        </>
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
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    itemStyle: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
  });
};

export default Menu;

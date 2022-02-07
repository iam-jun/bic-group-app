import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {StyleSheet, View} from 'react-native';
import HeaderAvatar from '~/beinComponents/Header/HeaderAvatar';
import DrawerItem from './DrawerItem';
import Divider from '~/beinComponents/Divider';

import {useKeySelector} from '~/hooks/selector';
import {useRootNavigation} from '~/hooks/navigation';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import images from '~/resources/images';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import mainStack from '~/router/navigator/MainStack/stack';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import authActions from '~/screens/Auth/redux/actions';
import * as modalActions from '~/store/modal/actions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';

import {getEnv} from '~/utils/env';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {t} = useBaseHook();

  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = themeStyles(theme);

  const {id, fullname, avatar, username} =
    useKeySelector(menuKeySelector.myProfile) || {};

  const onPressItem = (type: string) => () => {
    switch (type) {
      case 'myProfile':
        return rootNavigation.navigate(mainStack.userProfile, {userId: id});
      case 'draftPost':
        return rootNavigation.navigate(homeStack.draftPost);
      case 'accountSettings':
        return rootNavigation.navigate(menuStack.accountSettings);
      case 'component':
        return rootNavigation.navigate(menuStack.componentCollection);
      case 'logOut': {
        const alertPayload = {
          title: t('auth:text_sign_out'),
          content: 'Do you want to Log Out?',
          iconName: 'SignOutAlt',
          cancelBtn: true,
          onConfirm: () => dispatch(authActions.signOut()),
          confirmLabel: t('auth:text_sign_out'),
        };
        dispatch(modalActions.showAlert(alertPayload));
        break;
      }
      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const renderDivider = () => <Divider style={styles.divider} />;

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <HeaderAvatar
        firstLabel={fullname}
        secondLabel={username}
        avatar={avatar || images.img_user_avatar_default}
        onPress={onPressItem('myProfile')}
      />
      <DrawerItem
        icon="UilSmile"
        title="settings:title_set_a_custom_status"
        rightIcon="UilAngleRightB"
      />
      <DrawerItem
        icon="UilBookmarkFull"
        title="home:saved_posts"
        rightIcon="UilAngleRightB"
      />
      {renderDivider()}
      <DrawerItem
        icon="UilCog"
        title="settings:title_account_settings"
        rightIcon="UilAngleRightB"
        onPress={onPressItem('accountSettings')}
      />
      {renderDivider()}
      <DrawerItem
        icon="UilInfoCircle"
        title="settings:title_about_bein_app"
        rightTitle={
          getEnv('APP_VERSION')
            ? t('settings:text_version') + ' ' + getEnv('APP_VERSION')
            : undefined
        }
      />
      <DrawerItem icon="UilBookOpen" title="settings:title_app_policies" />
      <DrawerItem
        icon="UilQuestionCircle"
        title="settings:title_help_and_support"
      />
      <DrawerItem icon="UilCommentHeart" title="settings:title_feedback" />
      {renderDivider()}
      <DrawerItem
        icon="UilSignOutAlt"
        tintColor={colors.error}
        title="auth:text_sign_out"
        titleProps={{style: {color: colors.error}}}
        onPress={onPressItem('logOut')}
      />
    </DrawerContentScrollView>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {backgroundColor: colors.background},
    divider: {
      marginVertical: spacing.margin.small,
      backgroundColor: colors.bgFocus,
    },
  });
};

export default CustomDrawerContent;

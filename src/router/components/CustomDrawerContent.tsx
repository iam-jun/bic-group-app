import React from 'react';
import {StyleSheet} from 'react-native';
import HeaderAvatar from '~/beinComponents/Header/HeaderAvatar';
import DrawerItem from './DrawerItem';
import Divider from '~/beinComponents/Divider';
import {DrawerContentScrollView} from '@react-navigation/drawer';

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

import settings, {settingsMenu, infoMenu} from '~/constants/settings';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {t} = useBaseHook();

  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = themeStyles(theme);

  const {id, fullname, avatar} =
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
          onConfirm: () => {
            //waiting for close alert success before clear data
            setTimeout(() => dispatch(authActions.signOut()), 100);
          },
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

  const renderData = ({
    data,
    itemTestID,
  }: {
    data: Array<any>;
    itemTestID?: string;
  }) => {
    return (
      <>
        {data.map((item, index) => {
          return (
            <DrawerItem
              key={`${index}_menu_${item?.type}`}
              icon={item?.icon}
              testID={itemTestID ? `${itemTestID}.item.${index}` : undefined}
              title={item?.title}
              rightIcon={item?.rightIcon}
              rightTitle={item?.rightTitle}
              onPress={onPressItem(item?.type)}
              disabled={item?.disabled}
            />
          );
        })}
      </>
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <HeaderAvatar
        firstLabel={fullname}
        secondLabel="profile:title_view_profile"
        secondLabelProps={{useI18n: true}}
        avatar={avatar || images.img_user_avatar_default}
        onPress={onPressItem('myProfile')}
      />
      {renderData({
        data: settingsMenu,
        itemTestID: 'menu.account_settings',
      })}
      {renderDivider()}
      {renderData({
        data: infoMenu,
      })}
      {renderDivider()}
      <DrawerItem
        icon="UilSignOutAlt"
        tintColor={colors.error}
        title="auth:text_sign_out"
        titleProps={{style: {color: colors.error}}}
        onPress={onPressItem('logOut')}
        testID="menu.logout.item.0"
      />
      {__DEV__ &&
        renderData({
          data: settings,
        })}
    </DrawerContentScrollView>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    divider: {
      marginVertical: spacing.margin.small,
      backgroundColor: colors.bgFocus,
    },
  });
};

export default CustomDrawerContent;

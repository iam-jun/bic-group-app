import React, {FC} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import HeaderAvatar from '~/beinComponents/Header/HeaderAvatar';
import MenuSidebarItem from './MenuSidebarItem';
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

import settings, {
  settingsMenu,
  infoMenu,
  postFeatureMenu,
} from '~/constants/settings';
import spacing from '~/theme/spacing';

interface MenuSidebarContentProps {
  onCloseSidebar?: () => void;
}

const MenuSidebarContent: FC<MenuSidebarContentProps> = ({
  onCloseSidebar,
}: MenuSidebarContentProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {t} = useBaseHook();

  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = themeStyles(theme);

  const Container = Platform.OS === 'ios' ? View : ScrollView;
  // ScrollView not work with GestureHandler on iOS, in future if menu setting add more item, should test UI

  const {id, fullname, avatar} =
    useKeySelector(menuKeySelector.myProfile) || {};

  const onPressItem = (type: string) => () => {
    onCloseSidebar?.();
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
            <MenuSidebarItem
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
    <Container style={styles.container}>
      <HeaderAvatar
        firstLabel={fullname}
        secondLabel="profile:title_view_profile"
        secondLabelProps={{useI18n: true}}
        avatar={avatar || images.img_user_avatar_default}
        onPress={onPressItem('myProfile')}
      />
      {renderData({
        data: postFeatureMenu,
        itemTestID: 'menu.draft_posts',
      })}
      {renderDivider()}
      {renderData({
        data: settingsMenu,
        itemTestID: 'menu.account_settings',
      })}
      {renderDivider()}
      {renderData({
        data: infoMenu,
      })}
      {renderDivider()}
      <MenuSidebarItem
        icon="SignOutAlt"
        tintColor={colors.error}
        title="auth:text_sign_out"
        titleProps={{style: {color: colors.error}}}
        onPress={onPressItem('logOut')}
        testID="menu.logout.item.0"
      />
      {renderData({
        data: settings,
      })}
    </Container>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    divider: {
      marginVertical: spacing.margin.small,
      backgroundColor: colors.bgFocus,
    },
  });
};

export default MenuSidebarContent;

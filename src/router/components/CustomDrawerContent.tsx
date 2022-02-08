import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import settings, {settingsMenu, infoMenu} from '~/constants/settings';
import {DrawerActions} from '@react-navigation/native';

interface CustomDrawerContentProps {
  navigation: any;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
}: CustomDrawerContentProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {t} = useBaseHook();

  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = themeStyles(theme, insets, width);

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

  const onPressHideDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
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
    <>
      <View style={styles.statusbar} />
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.left}
          onPress={onPressHideDrawer}
        />
        <View style={styles.right}>
          <ScrollView>
            <HeaderAvatar
              firstLabel={fullname}
              secondLabel={username}
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
            />
            {__DEV__ &&
              renderData({
                data: settings,
              })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const themeStyles = (theme: ITheme, insets: any, width: number) => {
  const {spacing, colors} = theme;
  const topHeight = insets.top;
  const MAX_WIDTH = width * 0.869;

  return StyleSheet.create({
    container: {flex: 1, flexDirection: 'row'},
    left: {width: width - MAX_WIDTH},
    right: {width: MAX_WIDTH, backgroundColor: colors.background},
    divider: {
      marginVertical: spacing.margin.small,
      backgroundColor: colors.bgFocus,
    },
    statusbar: {
      height: topHeight,
      backgroundColor: colors.background,
    },
  });
};

export default CustomDrawerContent;

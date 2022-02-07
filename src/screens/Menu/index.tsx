import React, {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
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
import authActions from '~/screens/Auth/redux/actions';
import menuActions from '~/screens/Menu/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import mainStack from '~/router/navigator/MainStack/stack';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import appActions from '~/store/app/actions';
import MenuItem from '~/beinComponents/list/items/MenuItem';

import {useNavigation, DrawerActions} from '@react-navigation/native';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const navigation = useNavigation();

  /**
   * TODO: Update path in ~/src/constants/settings
   * like appSettingsMenu if want to set active state to the items
   */
  const [currentPath, setCurrentPath] = useState<string>('');
  const rootScreenName = useKeySelector('app.rootScreenName');

  useEffect(() => {
    setCurrentPath(rootScreenName);
  }, [rootScreenName, currentPath]);

  useEffect(() => {
    /**
     * Get 'settings' in first path
     * to handle user access the deeper level
     * in account setting by url
     */
    if (Platform.OS === 'web') {
      const initUrl = window.location.href;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parse = require('url-parse');
      const url = parse(initUrl, true);
      const paths = url.pathname.split('/');
      const route = paths.length > 0 ? paths[1] : '';
      if (route === '') return;

      dispatch(appActions.setRootScreenName(route));
    }
  }, []);

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

      case 'logOut': {
        const alertPayload = {
          title: i18next.t('auth:text_sign_out'),
          content: 'Do you want to Log Out?',
          iconName: 'SignOutAlt',
          cancelBtn: true,
          onConfirm: () => dispatch(authActions.signOut()),
          confirmLabel: i18next.t('auth:text_sign_out'),
        };
        dispatch(modalActions.showAlert(alertPayload));
        break;
      }

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const goToMyProfile = () => {
    navigation.dispatch(DrawerActions.openDrawer());
    // rootNavigation.navigate(mainStack.userProfile, {userId: id});
  };

  const renderDivider = () => <Divider style={styles.divider} />;

  const renderListView = ({
    data,
    itemTestID,
  }: {
    data: Array<any>;
    itemTestID?: string;
  }) => {
    return (
      <View style={styles.listContainerStyle}>
        {data.map((item, index) => {
          const isActive = currentPath === item.path;

          return (
            <MenuItem
              title={item.title}
              key={`menu_${item.type}`}
              onPress={() => onSettingPress(item)}
              icon={item.icon}
              testID={itemTestID ? `${itemTestID}.item.${index}` : undefined}
              rightSubTitle={item.rightSubTitle}
              isActive={isActive}
              type={item.type}
            />
          );
        })}
      </View>
    );
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header
        hideBack
        title="tabs:menus"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={isLaptop}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
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
            {renderDivider()}
            {renderListView({
              data: postFeatureMenu,
            })}
          </>
        )}
        {renderDivider()}
        {renderListView({
          data: appSettingsMenu,
          itemTestID: 'menu.account_settings',
        })}
        {renderDivider()}
        {renderListView({
          data: documentsMenu,
        })}

        {renderDivider()}
        {renderListView({
          data: logoutMenu,
          itemTestID: 'menu.logout',
        })}

        {__DEV__ && (
          <>
            {/* {renderDivider()} */}
            {renderListView({
              data: settings,
            })}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    header: {
      marginTop: spacing.margin.large,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    listContainerStyle: {
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
    },
  });
};

export default Menu;

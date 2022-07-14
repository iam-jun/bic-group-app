import i18next from 'i18next';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import settings, {
  appSettingsMenu,
  documentsMenu,
  logoutMenu,
  postFeatureMenu,
} from '~/constants/settings';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ISetting} from '~/interfaces/common';

import images from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';
import authActions from '~/screens/Auth/redux/actions';
import menuActions from '~/screens/Menu/redux/actions';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

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
          iconName: 'ArrowRightFromArc',
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
    rootNavigation.navigate(mainStack.userProfile, {userId: id});
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
      <View>
        {data.map((item, index) => {
          return (
            <MenuItem
              title={item.title}
              key={`menu_${item.type}`}
              onPress={() => onSettingPress(item)}
              icon={item.icon}
              testID={itemTestID ? `${itemTestID}.item.${index}` : undefined}
              rightSubTitle={item.rightSubTitle}
              type={item.type}
            />
          );
        })}
      </View>
    );
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header hideBack title="tabs:menus" titleTextProps={{useI18n: true}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderAvatarView
          firstLabel={fullname}
          secondLabel={email}
          avatar={avatar || images.img_user_avatar_default}
          containerStyle={styles.header}
          onPress={goToMyProfile}
        />
        <ViewSpacing height={theme.spacing.margin.large} />
        <>
          {renderDivider()}
          {renderListView({
            data: postFeatureMenu,
          })}
        </>
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
  });
};

export default Menu;

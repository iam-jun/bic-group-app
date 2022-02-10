import React from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import {IconType} from '~/resources/icons';
import Div from '~/beinComponents/Div';
import {appScreens} from '~/configs/navigator';
import MenuItem from '~/beinComponents/list/items/MenuItem';

const LeftPanel = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const currentPath = useKeySelector('app.rootScreenName') || 'newsfeed';

  const onPressNewsfeed = () => {
    rootNavigation.navigate(homeStack.newsfeed);
    DeviceEventEmitter.emit('onTabPress', 'home');
  };

  const onPressSavedPosts = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDraftPost = () => {
    rootNavigation.navigate(homeStack.draftPost);
  };

  const renderItem = ({
    icon,
    title,
    path,
    onPress,
    ...props
  }: {
    icon: IconType;
    title: string;
    path?: string;
    onPress?: () => void;
    [key: string]: any;
  }) => {
    const isActive = path === currentPath;

    return (
      <Div style={[styles.itemContainer]}>
        <MenuItem
          title={title}
          icon={icon}
          isActive={isActive}
          onPress={onPress}
          {...props}
        />
      </Div>
    );
  };

  return (
    <ScreenWrapper
      testID="VipScreen"
      disabledDarkMode
      isFullView
      style={styles.root}>
      {renderItem({
        icon: 'iconTabHomeBein',
        title: 'home:newsfeed',
        path: appScreens.newsfeed,
        onPress: onPressNewsfeed,
        testID: 'left_panel.newsfeed',
      })}
      {renderItem({
        icon: 'iconMenuDraft',
        title: 'home:draft_post',
        path: appScreens.draftPost,
        onPress: onPressDraftPost,
        type: 'draftPost',
        badgeColor: colors.textSecondary,
        testID: 'left_panel.draft',
      })}
      {renderItem({
        icon: 'iconMenuBookmarkRed',
        title: 'home:saved_posts',
        onPress: onPressSavedPosts,
        testID: 'left_panel.saved',
      })}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    root: {
      paddingTop: spacing.padding.base,
    },
    itemContainer: {
      marginHorizontal: spacing.margin.small,
    },
    itemActiveIndicator: {
      width: 4,
      height: 32,
      position: 'absolute',
      marginTop: 10,
      backgroundColor: colors.primary5,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    leftIcon: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.extraLarge,
    },
    badgeNumberContainer: {
      minWidth: 20,
      minHeight: 20,
      backgroundColor: colors.error,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeNumber: {
      color: colors.textReversed,
      marginTop: -2,
    },
  });
};

export default LeftPanel;

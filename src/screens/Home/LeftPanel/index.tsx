import React from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';

import { IconType } from '~/resources/icons';
import { appScreens } from '~/configs/navigator';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import spacing from '~/theme/spacing';

const LeftPanel = () => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

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
    onPress,
    ...props
  }: {
    icon: IconType;
    title: string;
    path?: string;
    onPress?: () => void;
    [key: string]: any;
  }) => (
    <View style={[styles.itemContainer]}>
      <MenuItem title={title} icon={icon} onPress={onPress} {...props} />
    </View>
  );

  return (
    <ScreenWrapper
      testID="VipScreen"
      disabledDarkMode
      isFullView
      style={styles.root}
    >
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
        badgeColor: colors.gray50,
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
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
      backgroundColor: colors.purple30,
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
      backgroundColor: colors.red60,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeNumber: {
      color: colors.white,
      marginTop: -2,
    },
  });
};

export default LeftPanel;

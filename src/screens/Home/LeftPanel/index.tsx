import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {IconType} from '~/resources/icons';
import {linkingConfigFullLaptop} from '~/configs/navigator';

const homeScreens =
  linkingConfigFullLaptop.config.screens.MainStack.screens.main.screens;

const PATH = {
  newsfeed: homeScreens.newsfeed.path,
  draftPost: homeScreens['draft-post'].path,
};

const LeftPanel = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const [currentPath, setCurrentPath] = useState<string>('');

  const draftPost = useKeySelector(postKeySelector.draft.posts) || [];

  useEffect(() => {
    loadCurrentPath();
  }, []);

  const loadCurrentPath = () => {
    /**
     * Currently only load on web, as this component only show on web
     * Need more work if need to get current active screen on tablet
     */
    if (Platform.OS === 'web') {
      const url = window.location.href;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parse = require('url-parse');
      const urlObj = parse(url, true);
      const path = urlObj.pathname.substr(1);
      setCurrentPath(path);
      return;
    }
  };

  const onPressNewsfeed = () => {
    rootNavigation.navigate(homeStack.newsfeed);
    setCurrentPath(PATH.newsfeed);
  };

  const onPressSavedPosts = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDraftPost = () => {
    rootNavigation.navigate(homeStack.draftPost);
    setCurrentPath(PATH.draftPost);
  };

  const renderBadgeNumber = (badgeNumber: number) => {
    if (!badgeNumber) {
      return null;
    }
    const number = badgeNumber > 9 ? '9+' : badgeNumber;
    return (
      <View style={styles.badgeNumberContainer}>
        <Text.Subtitle style={styles.badgeNumber}>{number}</Text.Subtitle>
      </View>
    );
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
    let style = {};
    if (path === currentPath) {
      style = {
        backgroundColor: theme.colors.placeholder,
      };
    }

    return (
      <PrimaryItem
        height={48}
        leftIconProps={{
          icon,
          size: 24,
          style: styles.leftIcon,
        }}
        leftIcon={icon}
        titleProps={{useI18n: true}}
        title={title}
        onPress={onPress}
        style={style}
        {...props}
      />
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
        path: PATH.newsfeed,
        onPress: onPressNewsfeed,
      })}
      {renderItem({
        icon: 'iconMenuDraft',
        title: 'home:draft_post',
        path: PATH.draftPost,
        onPress: onPressDraftPost,
        RightComponent: renderBadgeNumber(draftPost?.length || 0),
      })}
      {renderItem({
        icon: 'iconMenuBookmarkRed',
        title: 'home:saved_posts',
        onPress: onPressSavedPosts,
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

import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  BackHandler,
  DeviceEventEmitter, StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewsfeedList from '~/beinFragments/newsfeedList/NewsfeedList';
import { useAuthToken, useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useRootNavigation, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import NewsfeedSearch from '~/screens/Home/HomeSearch';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import menuActions from '~/screens/Menu/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import getEnv from '~/utils/env';
import HomeHeader from '~/screens/Home/components/HomeHeader';

const Home = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const listRef = useRef<any>();
  const headerRef = useRef<any>();
  const yShared = useSharedValue(0);

  const { rootNavigation } = useRootNavigation()
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const token = useAuthToken();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];
  const isShowSearch = useKeySelector(homeKeySelector.newsfeedSearch.isShow);

  const searchViewRef = useRef(null);

  const currentUserId = useUserIdAuth();

  const isFocused = useIsFocused();

  useEffect(
    () => {
      const taskId = requestAnimationFrame(() => {
        if (!isFocused) {
          DeviceEventEmitter.emit(
            'showHeader', true,
          );
        }
      });
      return () => cancelAnimationFrame(taskId);
    }, [isFocused],
  );

  const getData = (isRefresh?: boolean) => {
    dispatch(homeActions.getHomePosts({ isRefresh }));
  };

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({ animated: true, offset: 0 });
        headerRef?.current?.hideSearch?.();
      }
    },
    [listRef],
  );

  useEffect(
    () => {
      if (
        isInternetReachable
      && token
      && (!homePosts || homePosts?.length === 0)
      && !refreshing
      ) {
        getData(true);
        dispatch(postActions.getAllPostContainingVideoInProgress());
      }
    }, [token, isInternetReachable, homePosts],
  );

  useEffect(
    () => {
      if (isInternetReachable) {
        if (lossInternet && homePosts?.length > 0) {
          setLossInternet(false);
          getData();
        }
      } else {
        setLossInternet(true);
      }
    }, [isInternetReachable],
  );

  useEffect(
    () => {
      if (currentUserId) dispatch(menuActions.getMyProfile({ userId: currentUserId }));
    }, [],
  );

  const handleBackPress = () => {
    if (isShowSearch) {
      dispatch(homeActions.clearAllNewsfeedSearch());
    } else if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  };

  useBackPressListener(handleBackPress);

  const onPressSearch = () => {
    DeviceEventEmitter.emit('showHeader', true);
    dispatch(homeActions.setNewsfeedSearch({ isShow: true, searchViewRef }));
  }

  const navigateToChat = () => {
    openUrl(getEnv('BEIN_CHAT_DEEPLINK'));
  };

  const onEndReach = useCallback(
    () => getData(), [],
  );

  const onRefresh = useCallback(
    () => getData(true), [],
  );

  const onScrollY = (y: number) => {
    yShared.value = y
  }

  return (
    <View style={styles.container}>
      <HomeHeader
        style={styles.headerContainer}
        yShared={yShared}
        onPressSearch={onPressSearch}
        onPressChat={navigateToChat}
      />
      <NewsfeedList
        data={homePosts}
        refreshing={refreshing}
        canLoadMore={!noMoreHomePosts}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScrollY={onScrollY}
      />
      <View style={styles.statusBar} />
      <NewsfeedSearch searchViewRef={searchViewRef} style={styles.searchContainer} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    statusBar: {
      zIndex: 10,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: insets.top,
      backgroundColor: colors.neutral,
    },
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    searchContainer: {
      zIndex: 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerCreatePost: {
      width: '100%',
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
  });
};

export default Home;

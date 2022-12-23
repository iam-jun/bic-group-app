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

import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useAuthController from '~/screens/auth/store';
import { getAuthToken } from '~/screens/auth/store/selectors';
import NewsfeedList from '~/screens/Home/components/NewsfeedList';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useRootNavigation, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import NewsfeedSearch from '~/screens/Home/HomeSearch';
import homeActions from '~/storeRedux/home/actions';
import homeKeySelector from '~/storeRedux/home/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import getEnv from '~/utils/env';
import HomeHeader from '~/screens/Home/components/HomeHeader';
import useHomeStore from '~/screens/Home/store';
import useCommonController from '../store';
import useFilterToolbarStore from '~/components/FilterToolbar/store';

const Home = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const listRef = useRef<any>();
  const headerRef = useRef<any>();
  const yShared = useSharedValue(0);

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const commonActions = useCommonController((state) => state.actions);
  const resetFilter = useFilterToolbarStore((state) => state.reset);

  const token = useAuthController(getAuthToken);

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const {
    contentFilter, attributeFilter, feed, actions,
  } = useHomeStore();
  const dataFiltered = feed[contentFilter][attributeFilter];
  const {
    data: homePosts, canLoadMore, refreshing,
  } = dataFiltered;

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
    actions.getDataFeed(isRefresh);
  };

  useEffect(() => {
    actions.getDataFeed(true);
    yShared.value = withDelay(200, withTiming(0));
  }, [contentFilter, attributeFilter]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({ animated: true, offset: 0 });
        headerRef?.current?.hideSearch?.();
      }

      if (tabName !== 'home' && isShowSearch) {
        /**
         * The issue happens when a user opens search content modal on newsfeed,
         * then move to tab `Communities` without closing it, and goes to community profile,
         * the search modal is then shown unexpectedly.
         *
         * That's why we need to clear and close current search on newsfeed first before
         * moving to another screen.
         */
        dispatch(homeActions.clearAllNewsfeedSearch());
        resetFilter();
      }
    },
    [listRef, isShowSearch],
  );

  useEffect(
    () => {
      if (
        isInternetReachable
      && token
      && (!homePosts || homePosts?.length === 0)
      && !refreshing
      && canLoadMore
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
      if (currentUserId) commonActions.getMyProfile({ userId: currentUserId });
    }, [],
  );

  const handleBackPress = () => {
    if (isShowSearch) {
      dispatch(homeActions.clearAllNewsfeedSearch());
      resetFilter();
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
  };

  const navigateToChat = () => {
    openUrl(getEnv('BEIN_CHAT_DEEPLINK'), () => {
      dispatch(modalActions.showAlert({
        title: t('home:title_install_chat'),
        content: t('home:text_desc_install_chat'),
      }));
    });
  };

  const onEndReach = useCallback(
    () => getData(),
    [contentFilter, attributeFilter],
  );

  const onRefresh = useCallback(
    () => getData(true),
    [contentFilter, attributeFilter],
  );

  const onScrollY = (y: number) => {
    yShared.value = y;
  };

  return (
    <View style={styles.container}>
      <NewsfeedList
        key={`${contentFilter}_${attributeFilter}`}
        data={homePosts}
        refreshing={refreshing}
        canLoadMore={canLoadMore}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScrollY={onScrollY}
        contentFilter={contentFilter}
        attributeFilter={attributeFilter}
      />
      <HomeHeader
        style={styles.headerContainer}
        yShared={yShared}
        onPressSearch={onPressSearch}
        onPressChat={navigateToChat}
      />
      <View style={styles.statusBar} />
      <NewsfeedSearch searchViewRef={searchViewRef} style={styles.searchContainer} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
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
      backgroundColor: colors.neutral,
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
      ...elevations.e2,
    },
  });
};

export default Home;

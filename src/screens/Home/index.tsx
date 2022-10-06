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
import NewsfeedList from '~/components/NewsfeedList';
import { useBaseHook } from '~/hooks';
import { useAuthToken, useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useRootNavigation, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import NewsfeedSearch from '~/screens/Home/HomeSearch';
import { HOME_TAB_TYPE } from '~/screens/Home/store/Interface';
import homeActions from '~/storeRedux/home/actions';
import homeKeySelector from '~/storeRedux/home/keySelector';
import menuActions from '~/storeRedux/menu/actions';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import getEnv from '~/utils/env';
import HomeHeader from '~/screens/Home/components/HomeHeader';
import useHomeStore from '~/screens/Home/store';

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

  const token = useAuthToken();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const {
    activeTab, tabImportant, tabNewsfeed, actions,
  } = useHomeStore();
  const tabData = activeTab === HOME_TAB_TYPE.NEWSFEED ? tabNewsfeed : tabImportant;
  const { data: homePosts, canLoadMore, refreshing } = tabData;

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
    actions.getTabData(activeTab, isRefresh);
  };

  useEffect(() => {
    actions.getTabData(activeTab, true);
    yShared.value = withDelay(withTiming(0), 200);
  }, [activeTab]);

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
    [activeTab],
  );

  const onRefresh = useCallback(
    () => getData(true),
    [activeTab],
  );

  const onScrollY = (y: number) => {
    yShared.value = y;
  };

  return (
    <View style={styles.container}>
      <NewsfeedList
        data={homePosts}
        refreshing={refreshing}
        canLoadMore={canLoadMore}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScrollY={onScrollY}
        activeTab={activeTab}
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
    },
  });
};

export default Home;

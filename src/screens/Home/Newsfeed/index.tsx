import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  DeviceEventEmitter, StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewsfeedList from '~/beinFragments/newsfeedList/NewsfeedList';
import { useAuthToken, useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import NewsfeedSearch from '~/screens/Home/Newsfeed/NewsfeedSearch';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import menuActions from '~/screens/Menu/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import getEnv from '~/utils/env';
import HomeHeader from '~/screens/Home/Newsfeed/components/HomeHeader';

const Newsfeed = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const listRef = useRef<any>();
  const headerRef = useRef<any>();
  const yShared = useSharedValue(0);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const token = useAuthToken();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];

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
    headerRef?.current?.goBack?.();
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
        HeaderComponent={<HeaderCreatePost style={styles.headerCreatePost} />}
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
    flex1: { flex: 1 },
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
      backgroundColor: colors.neutral1,
    },
    searchContainer: {
      zIndex: 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerOnLaptop: {
      backgroundColor: colors.neutral1,
    },
    placeholder: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCreatePost: {
      width: '100%',
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    importantCount: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.small,
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

export default Newsfeed;

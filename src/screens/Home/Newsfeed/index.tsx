import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  DeviceEventEmitter, StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { useSharedValue, withTiming } from 'react-native-reanimated';
import NewsfeedList from '~/beinFragments/newsfeedList/NewsfeedList';
import { useBaseHook } from '~/hooks';
import { useAuthToken, useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadSetNewsfeedSearch } from '~/interfaces/IHome';
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
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const token = useAuthToken();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];

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

  const onShowSearch = (
    isShow: boolean, searchInputRef?: any,
  ) => {
    if (isShow) {
      DeviceEventEmitter.emit(
        'showHeader', true,
      );
      dispatch(homeActions.setNewsfeedSearch({ isShow, searchInputRef }));
    } else {
      dispatch(homeActions.clearAllNewsfeedSearch());
    }
  };

  const onSearchText = (
    text: string, searchInputRef: any,
  ) => {
    const searchText = text?.trim?.() || '';
    const payload: IPayloadSetNewsfeedSearch = { searchText };
    if (!searchText) {
      payload.isSuggestion = true;
      searchInputRef?.current?.focus?.();
    }
    dispatch(homeActions.setNewsfeedSearch(payload));
  };

  const onFocusSearch = () => {
    dispatch(homeActions.setNewsfeedSearch({ isSuggestion: true, searchResults: [] }));
  };

  const onSubmitSearch = () => {
    dispatch(homeActions.setNewsfeedSearch({ isSuggestion: false, searchResults: [] }));
  };

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
    <View
      style={styles.container}
    >
      <View style={styles.headerMobile}>
        {/* <Header */}
        {/*  headerRef={headerRef} */}
        {/*  avatar={images.logo_beincomm} */}
        {/*  hideBack */}
        {/*  searchPlaceholder={t('input:search_post')} */}
        {/*  autoFocusSearch */}
        {/*  onPressChat={navigateToChat} */}
        {/*  onShowSearch={onShowSearch} */}
        {/*  onSearchText={onSearchText} */}
        {/*  onFocusSearch={onFocusSearch} */}
        {/*  onSubmitSearch={onSubmitSearch} */}
        {/*  title="post:news_feed" */}
        {/*  titleTextProps={{ useI18n: true }} */}
        {/* /> */}
        <HomeHeader yShared={yShared} onPressChat={navigateToChat} />
      </View>
      <View style={styles.flex1}>
        <NewsfeedList
          data={homePosts}
          refreshing={refreshing}
          canLoadMore={!noMoreHomePosts}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          onScrollY={onScrollY}
          HeaderComponent={<HeaderCreatePost style={styles.headerCreatePost} />}
        />
        <NewsfeedSearch headerRef={headerRef} />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;

  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral1,
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
    headerMobile: {
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1,
    },
  });
};

export default Newsfeed;

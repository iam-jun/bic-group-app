import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  BackHandler,
  DeviceEventEmitter, StyleSheet,
  View,
} from 'react-native';

import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useAuthController from '~/screens/auth/store';
import { getAuthToken } from '~/screens/auth/store/selectors';
import NewsfeedList from '~/screens/Home/components/NewsfeedList';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useBackPressListener, useRootNavigation, useTabPressListener } from '~/hooks/navigation';
import { ITabTypes } from '~/interfaces/IRouter';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import HomeHeader from '~/screens/Home/components/HomeHeader';
import useHomeStore from '~/screens/Home/store';
import useCommonController from '../store';
import useModalStore from '~/store/modal';
import usePostsInProgressStore from './components/VideoProcessingNotice/store';
import useAppStore from '~/store/app';
import { chatSchemes } from '~/constants/chat';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import useRemoteConfigStore from '~/store/remoteConfig';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

const Home = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const listRef = useRef<any>();
  const yShared = useSharedValue(0);

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const commonActions = useCommonController((state) => state.actions);
  const { showAlert } = useModalStore((state) => state.actions);
  const postContainingVideoInProgressActions = usePostsInProgressStore((state) => state.actions);

  const token = useAuthController(getAuthToken);

  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const {
    contentFilter, attributeFilter, feed, actions,
  } = useHomeStore();
  const dataFiltered = feed[contentFilter][attributeFilter];
  const {
    data: homePosts, hasNextPage, refreshing,
  } = dataFiltered;

  const currentUserId = useUserIdAuth();

  const isFocused = useIsFocused();
  const redirectUrl = useAppStore((state) => state.redirectUrl);
  const appActions = useAppStore((state) => state.actions);
  const appStoreUrlChat = useRemoteConfigStore((state) => state.appStoreUrlChat);

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
      && hasNextPage
      ) {
        getData(true);
        postContainingVideoInProgressActions.getPosts();
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

  useEffect(
    () => {
      if (redirectUrl) {
        openUrl(redirectUrl);
        appActions.setRedirectUrl('');
      }
    }, [redirectUrl],
  );

  const handleBackPress = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  };

  useBackPressListener(handleBackPress);

  const onPressSearch = () => {
    rootNavigation.push(searchStack.searchMain);
  };

  const HeaderImageComponent = (
    <View style={styles.iconChatContainer}>
      <Icon
        icon="iconBeinChat"
        size={64}
        style={styles.iconChat}
      />
    </View>
  );

  const navigateToChat = () => {
    openUrl(chatSchemes.FULL_DEEPLINK, () => {
      showAlert({
        HeaderImageComponent,
        headerStyle: styles.alertHeaderStyle,
        cancelBtn: true,
        buttonViewStyle: styles.buttonViewStyle,
        title: t('home:title_install_chat'),
        titleProps: { style: { flex: 1, textAlign: 'center' }, variant: 'h4' },
        content: t('home:text_desc_install_chat'),
        ContentComponent: Text.BodyM,
        cancelLabel: t('common:text_not_now'),
        cancelBtnProps: { style: { marginEnd: 0 } },
        confirmLabel: t('home:text_get_bic_chat'),
        confirmBtnProps: { style: { marginBottom: spacing.margin.small } },
        onConfirm: () => {
          !!appStoreUrlChat && openUrl(appStoreUrlChat);
        },
      });
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
        canLoadMore={hasNextPage}
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
    iconChatContainer: {
      alignItems: 'center',
      paddingVertical: spacing.padding.extraLarge,
    },
    iconChat: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertHeaderStyle: {
      marginBottom: 0,
      borderBottomWidth: 0,
    },
    buttonViewStyle: {
      borderTopWidth: 0,
      flexDirection: 'column-reverse',
      justifyContent: 'center',
      paddingHorizontal: spacing.padding.extraLarge,
      paddingBottom: spacing.padding.extraLarge,
    },
  });
};

export default Home;

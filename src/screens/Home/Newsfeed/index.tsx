import {useIsFocused} from '@react-navigation/core';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  InteractionManager,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import NewsfeedList from '~/beinFragments/newsfeedList/NewsfeedList';
import {appScreens} from '~/configs/navigator';
import {chatSchemes} from '~/constants/chat';
import {useBaseHook} from '~/hooks';
import {useAuthToken, useUserIdAuth} from '~/hooks/auth';
import {useBackPressListener, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IPayloadSetNewsfeedSearch} from '~/interfaces/IHome';
import {ITabTypes} from '~/interfaces/IRouter';
import images from '~/resources/images';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import NewsfeedSearch from '~/screens/Home/Newsfeed/NewsfeedSearch';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import menuActions from '~/screens/Menu/redux/actions';
import appActions from '~/store/app/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {openLink} from '~/utils/common';

const Newsfeed = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const listRef = useRef<any>();
  const headerRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const [newsfeedWidth, setNewsfeedWidth] = useState<number>(
    deviceDimensions.phone,
  );
  const styles = createStyle(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const token = useAuthToken();

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];

  const currentUserId = useUserIdAuth();

  const isFocused = useIsFocused();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (isFocused)
        dispatch(appActions.setRootScreenName(appScreens.newsfeed));
    });
  }, [isFocused]);

  const getData = (isRefresh?: boolean) => {
    dispatch(homeActions.getHomePosts({isRefresh}));
  };

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
        headerRef?.current?.hideSearch?.();
      }
    },
    [listRef],
  );

  useEffect(() => {
    if (
      isInternetReachable &&
      token &&
      (!homePosts || homePosts?.length === 0) &&
      !refreshing
    ) {
      getData(true);
    }
  }, [token, isInternetReachable, homePosts]);

  useEffect(() => {
    if (isInternetReachable) {
      if (lossInternet && homePosts?.length > 0) {
        setLossInternet(false);
        getData();
      }
    } else {
      setLossInternet(true);
    }
  }, [isInternetReachable]);

  useEffect(() => {
    dispatch(menuActions.getMyProfile({userId: currentUserId}));
  }, []);

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const onShowSearch = (isShow: boolean, searchInputRef?: any) => {
    if (isShow) {
      dispatch(homeActions.setNewsfeedSearch({isShow: isShow, searchInputRef}));
    } else {
      dispatch(homeActions.clearAllNewsfeedSearch());
    }
  };

  const onSearchText = (text: string, searchInputRef: any) => {
    const searchText = text?.trim?.() || '';
    const payload: IPayloadSetNewsfeedSearch = {searchText};
    if (!searchText) {
      payload.isSuggestion = true;
      searchInputRef?.current?.focus?.();
    }
    dispatch(homeActions.setNewsfeedSearch(payload));
  };

  const onFocusSearch = () => {
    dispatch(
      homeActions.setNewsfeedSearch({isSuggestion: true, searchResults: []}),
    );
  };

  const onSubmitSearch = () => {
    dispatch(
      homeActions.setNewsfeedSearch({isSuggestion: false, searchResults: []}),
    );
  };

  const renderHeader = () => {
    if (isLaptop)
      return (
        <Header
          headerRef={headerRef}
          hideBack
          title={'post:news_feed'}
          titleTextProps={{useI18n: true}}
          style={styles.headerOnLaptop}
          removeBorderAndShadow
          onPressChat={navigateToChat}
          onShowSearch={onShowSearch}
          onSearchText={onSearchText}
          searchPlaceholder={t('input:search_post')}
          autoFocusSearch
          onFocusSearch={onFocusSearch}
          onSubmitSearch={onSubmitSearch}
        />
      );

    return (
      <View style={styles.headerMobile}>
        <Header
          headerRef={headerRef}
          avatar={images.logo_bein}
          hideBack
          searchPlaceholder={t('input:search_post')}
          autoFocusSearch
          onPressChat={navigateToChat}
          onShowSearch={onShowSearch}
          onSearchText={onSearchText}
          onFocusSearch={onFocusSearch}
          onSubmitSearch={onSubmitSearch}
          title={'post:news_feed'}
          titleTextProps={{useI18n: true}}
        />
      </View>
    );
  };

  const navigateToChat = () => {
    openLink(chatSchemes.CHANNELS);
  };

  const onEndReach = useCallback(() => getData(), []);

  const onRefresh = useCallback(() => getData(true), []);

  return (
    <View
      style={styles.container}
      onLayout={event => setNewsfeedWidth(event.nativeEvent.layout.width)}>
      {renderHeader()}
      <View style={styles.flex1}>
        <NewsfeedList
          data={homePosts}
          refreshing={refreshing}
          canLoadMore={!noMoreHomePosts}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          HeaderComponent={
            <HeaderCreatePost
              style={styles.headerCreatePost}
              parentWidth={newsfeedWidth}
            />
          }
        />
        <NewsfeedSearch headerRef={headerRef} />
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;

  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgSecondary,
    },
    headerOnLaptop: {
      backgroundColor: colors.surface,
    },
    placeholder: {
      flex: 1,
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
        },
      }),
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
    headerMobile:
      Platform.OS !== 'web'
        ? {position: 'absolute', top: 0, width: '100%', zIndex: 1}
        : {},
  });
};

export default Newsfeed;

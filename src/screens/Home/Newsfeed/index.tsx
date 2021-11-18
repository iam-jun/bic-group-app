import {useIsFocused} from '@react-navigation/core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ITabTypes} from '~/interfaces/IRouter';
import images from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import appActions from '~/store/app/actions';
import {deviceDimensions} from '~/theme/dimension';

import {ITheme} from '~/theme/interfaces';
import NewsfeedSearch from '~/screens/Home/Newsfeed/NewsfeedSearch';
import {useBaseHook} from '~/hooks';
import {IPayloadSetNewsfeedSearch} from '~/interfaces/IHome';

const Newsfeed = () => {
  const listRef = useRef<any>();

  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const [newsfeedWidth, setNewsfeedWidth] = useState<number>(
    deviceDimensions.phone,
  );
  const styles = createStyle(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {streamClient} = useContext(AppContext);
  const streamRef = useRef<any>({}).current;
  streamRef.value = streamClient;

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const userId = useUserIdAuth();
  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];

  const isFocused = useIsFocused();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (isFocused)
        dispatch(appActions.setRootScreenName(appScreens.newsfeed));
    });
  }, [isFocused]);

  const getData = (isRefresh?: boolean) => {
    const streamClient = streamRef.value;
    if (streamClient) {
      dispatch(
        homeActions.getHomePosts({
          streamClient,
          userId: `${userId}`,
          isRefresh,
        }),
      );
    }
  };

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (streamClient && (!homePosts || homePosts?.length === 0)) {
        getData(true);
      }
    });
  }, [streamClient]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(postActions.addToAllPosts({data: homePosts}));
    });
  }, [homePosts]);

  const onShowSearch = (isShow: boolean, searchInputRef?: any) => {
    if (isShow) {
      dispatch(homeActions.setNewsfeedSearch({isShow: isShow, searchInputRef}));
    } else {
      dispatch(homeActions.clearNewsfeedSearch());
      dispatch(homeActions.clearNewsfeedSearchFilter());
      dispatch(homeActions.clearNewsfeedSearchUsers());
    }
  };

  const onSearchText = (text: string, searchInputRef: any) => {
    const payload: IPayloadSetNewsfeedSearch = {searchText: text};
    if (!text) {
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
          hideBack
          title={'post:news_feed'}
          titleTextProps={{useI18n: true}}
          style={styles.headerOnLaptop}
          removeBorderAndShadow
          onShowSearch={onShowSearch}
          onSearchText={onSearchText}
          searchPlaceholder={t('input:search_post')}
          autoFocusSearch
          onFocusSearch={onFocusSearch}
          onSubmitSearch={onSubmitSearch}
        />
      );

    return (
      <Header
        avatar={images.logo_bein}
        hideBack
        menuIcon={'Edit'}
        onPressMenu={navigateToCreatePost}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
        searchPlaceholder={t('input:search_post')}
        autoFocusSearch
        onFocusSearch={onFocusSearch}
        onSubmitSearch={onSubmitSearch}
      />
    );
  };

  const navigateToCreatePost = () => {
    rootNavigation.navigate(homeStack.createPost);
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
        <NewsfeedSearch />
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
  });
};

export default Newsfeed;

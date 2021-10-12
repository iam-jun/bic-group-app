import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import PostItem from '~/beinComponents/list/items/PostItem';

import ListView from '~/beinComponents/list/ListView';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import images from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {deviceDimensions} from '~/theme/dimension';

import {ITheme} from '~/theme/interfaces';
import {ITabTypes} from '~/router/navigator/MainStack/MainTabs/screens';

let newsfeedPostCount = 0;
const itemLeftToGetMore = 10;

const Newsfeed = () => {
  const listRef = useRef<any>();

  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const [newsfeedWidth, setNewsfeedWidth] = useState<number>(
    deviceDimensions.phone,
  );
  const styles = createStyle(theme, newsfeedWidth);
  const dispatch = useDispatch();
  const {streamClient} = useContext(AppContext);

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const userId = useUserIdAuth();
  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts) || [];

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const getData = (isRefresh?: boolean) => {
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
    getData(true);
  }, [streamClient]);

  useEffect(() => {
    dispatch(postActions.addToAllPosts(homePosts));
  }, [homePosts]);

  const renderHeader = () => {
    if (isLaptop)
      return (
        <Header
          hideBack
          title={'post:news_feed'}
          titleTextProps={{useI18n: true}}
          style={styles.headerOnLaptop}
          removeBorderAndShadow
        />
      );

    return (
      <Header
        avatar={images.logo_bein}
        hideBack
        menuIcon={'Edit'}
        onPressMenu={navigateToCreatePost}
      />
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.listFooter}>
        {!noMoreHomePosts && !refreshing && (
          <ActivityIndicator color={theme.colors.bgFocus} />
        )}
        {!refreshing && noMoreHomePosts && (
          <Text.Subtitle color={theme.colors.textSecondary}>
            No more homeposts
          </Text.Subtitle>
        )}
      </View>
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <HeaderCreatePostPlaceholder
          style={styles.headerCreatePost}
          parentWidth={newsfeedWidth}
        />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
      </View>
    );
  };

  const navigateToCreatePost = () => {
    rootNavigation.navigate(homeStack.createPost);
  };

  useEffect(() => {
    newsfeedPostCount = homePosts?.length;
  }, [homePosts?.length]);

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    const lastVisibleIndex = viewableItems?.[viewableItems?.length - 1]?.index;
    if (newsfeedPostCount - lastVisibleIndex < itemLeftToGetMore) {
      getData();
    }
  }).current;

  return (
    <View
      style={styles.container}
      onLayout={event => setNewsfeedWidth(event.nativeEvent.layout.width)}>
      {renderHeader()}
      {homePosts.length === 0 && refreshing ? (
        renderPlaceholder()
      ) : (
        <ListView
          listRef={listRef}
          isFullView
          containerStyle={styles.listContainer}
          data={homePosts}
          refreshing={refreshing}
          onRefresh={() => getData(true)}
          onEndReachedThreshold={1}
          onLoadMore={() => getData()}
          renderItem={renderItem}
          onViewableItemsChanged={onViewableItemsChanged}
          ListHeaderComponent={() => (
            <HeaderCreatePost
              style={styles.headerCreatePost}
              parentWidth={newsfeedWidth}
            />
          )}
          ListFooterComponent={renderFooter}
          renderItemSeparator={() => (
            <ViewSpacing height={theme.spacing.margin.large} />
          )}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme, newsfeedWidth: number) => {
  const {colors, spacing, dimension} = theme;

  return StyleSheet.create({
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

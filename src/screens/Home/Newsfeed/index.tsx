import React, {useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';
import homeActions from '~/screens/Home/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';

import ListView from '~/beinComponents/list/ListView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Header from '~/beinComponents/Header';
import PostItem from '~/beinComponents/list/items/PostItem';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import Text from '~/beinComponents/Text';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import {deviceDimensions} from '~/theme/dimension';

const Newsfeed = () => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
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
      <View style={styles.listContainer}>
        <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
      </View>
    );
  };

  const navigateToCreatePost = () => {
    rootNavigation.navigate(homeStack.createPost);
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {homePosts.length === 0 && refreshing ? (
        renderPlaceholder()
      ) : (
        <ListView
          isFullView
          containerStyle={styles.listContainer}
          data={homePosts}
          refreshing={refreshing}
          onRefresh={() => getData(true)}
          onLoadMore={() => getData()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <HeaderCreatePost style={styles.headerCreatePost} />
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

const createStyle = (theme: ITheme) => {
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
    listContainer: {
      flex: 1,
      ...Platform.select({
        web: {
          alignSelf: 'center',
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
        },
      }),
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

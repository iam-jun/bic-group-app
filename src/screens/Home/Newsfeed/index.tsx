import React, {useEffect, useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
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

const Newsfeed = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const dispatch = useDispatch();
  const {streamClient} = useContext(AppContext);

  const userId = useUserIdAuth();
  const refreshing = useKeySelector(homeKeySelector.refreshingHomePosts);
  const noMoreHomePosts = useKeySelector(homeKeySelector.noMoreHomePosts);
  const homePosts = useKeySelector(homeKeySelector.homePosts);

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

  return (
    <View style={styles.container}>
      <Header
        avatar={images.logo_bein}
        hideBack
        title={'post:news_feed'}
        titleTextProps={{useI18n: true}}
        icon={images.logo_bein}
      />
      <ListView
        isFullView
        style={styles.listStyle}
        containerStyle={styles.listContainer}
        data={homePosts}
        refreshing={refreshing}
        onRefresh={() => getData(true)}
        onLoadMore={() => getData()}
        renderItem={renderItem}
        ListHeaderComponent={() =>
          (!refreshing || homePosts?.length > 0) && (
            <HeaderCreatePost style={styles.headerCreatePost} />
          )
        }
        ListFooterComponent={renderFooter}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing?.margin.base} />
        )}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
      backgroundColor: colors.bgDisable,
    },
    listStyle: {
      backgroundColor: colors.bgDisable,
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCreatePost: {
      marginTop: spacing.margin.base,
    },
  });
};

export default Newsfeed;

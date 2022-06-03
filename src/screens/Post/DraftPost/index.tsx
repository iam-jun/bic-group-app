import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import Image from '~/beinComponents/Image';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import {appScreens} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import {IPayloadGetDraftPosts} from '~/interfaces/IPost';
import images from '~/resources/images';
import PostViewDraft from '~/screens/Post/components/PostViewDraft';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import appActions from '~/store/app/actions';
import {ITheme} from '~/theme/interfaces';

const DraftPost = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const isFocused = useIsFocused();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  useEffect(() => {
    if (isFocused) dispatch(appActions.setRootScreenName(appScreens.draftPost));
  }, [isFocused]);

  useEffect(() => {
    if (isInternetReachable) {
      if (lossInternet) {
        setLossInternet(false);
        getData(false);
      }
    } else {
      setLossInternet(true);
    }
  }, [isInternetReachable]);

  //get draft post called from MainTabs
  const draftPostsData = useKeySelector(postKeySelector.draftPostsData) || {};
  const {posts: draftPosts = [], canLoadMore, refreshing} = draftPostsData;

  const getData = (isRefreshing?: boolean) => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = {
        isRefresh: isRefreshing,
      };
      dispatch(postActions.getDraftPosts(payload));
    }
  };

  const renderItem = ({item}: any) => {
    return <PostViewDraft data={item} />;
  };

  const renderFooter = () => {
    return (
      <View>
        {canLoadMore && !refreshing && (
          <View testID="draft_post.load_more_view" style={styles.listFooter}>
            <ActivityIndicator color={theme.colors.bgFocus} />
          </View>
        )}
        {!refreshing && !canLoadMore && (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View testID="draft_post.empty_view" style={styles.emptyContainer}>
        <Image source={images.img_empty_draft} style={styles.imgEmpty} />
        <Text.H6 useI18n color={colors.textSecondary}>
          post:draft:title_no_draft_posts
        </Text.H6>
        <Text useI18n color={colors.textSecondary}>
          post:draft:text_no_draft_posts
        </Text>
      </View>
    );
  };

  const title = `${t('home:draft_post')}${
    draftPosts?.length > 0
      ? ` (${draftPosts.length > 9 ? '9+' : draftPosts.length})`
      : ''
  }`;

  return (
    <View style={styles.container}>
      <Header title={title} />
      <ListView
        isFullView
        containerStyle={styles.listContainer}
        data={draftPosts}
        renderItem={renderItem}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
        ListHeaderComponent={() => <ViewSpacing height={spacing.margin.base} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={() => getData(true)}
        onLoadMore={() => getData(false)}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    listContainer: {
      flex: 1,
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      height: dimension.deviceHeight * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgEmpty: {
      width: 250,
      height: 200,
    },
  });
};

export default DraftPost;

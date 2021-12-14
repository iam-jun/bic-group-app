import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

import Header from '~/beinComponents/Header';
import PostViewDraft from '~/screens/Post/components/PostViewDraft';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ListView from '~/beinComponents/list/ListView';
import postActions from '~/screens/Post/redux/actions';
import {IPayloadGetDraftPosts} from '~/interfaces/IPost';
import {useUserIdAuth} from '~/hooks/auth';
import {AppContext} from '~/contexts/AppContext';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {useBaseHook} from '~/hooks';
import {useIsFocused} from '@react-navigation/core';
import appActions from '~/store/app/actions';
import {appScreens} from '~/configs/navigator';

const DraftPost = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const {streamClient} = useContext(AppContext);

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
  const {
    posts: draftPosts = [],
    canLoadMore,
    refreshing,
    loading,
  } = draftPostsData;

  const getData = (isRefreshing?: boolean) => {
    if (userId && streamClient) {
      const payload: IPayloadGetDraftPosts = {
        userId: userId,
        streamClient: streamClient,
        isRefresh: isRefreshing,
      };
      dispatch(postActions.getDraftPosts(payload));
    }
  };

  const renderItem = ({item, index}: any) => {
    return <PostViewDraft data={item} />;
  };

  const renderFooter = () => {
    return (
      <View>
        {canLoadMore && !refreshing && (
          <View style={styles.listFooter}>
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
      <View style={styles.emptyContainer}>
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
      <Header title={title} hideBackOnLaptop />
      <ListView
        isFullView
        containerStyle={styles.listContainer}
        data={draftPosts}
        renderItem={renderItem}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
        ListHeaderComponent={() => (
          <ViewSpacing
            height={
              Platform.OS === 'web'
                ? spacing.margin.extraLarge
                : spacing.margin.base
            }
          />
        )}
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
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgSecondary,
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

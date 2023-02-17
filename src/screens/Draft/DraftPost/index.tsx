import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, View,
} from 'react-native';

import Image from '~/beinComponents/Image';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import { useUserIdAuth } from '~/hooks/auth';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadGetDraftPosts } from '~/interfaces/IPost';
import images from '~/resources/images';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import PostDraftView from './components/PostDraftView';
import useDraftPostStore from './store';

const DraftPost = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const userId = useUserIdAuth();
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const {
    posts: draftPosts = [], hasNextPage, refreshing, actions,
  } = useDraftPostStore();

  useEffect(() => {
    getData(true);
  }, []);

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

  const getData = (isRefreshing?: boolean) => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = {
        isRefresh: isRefreshing,
      };
      actions.getDraftPosts(payload);
    }
  };

  const renderItem = ({ item }: any) => <PostDraftView data={item} />;

  const renderFooter = () => (
    <View>
      {hasNextPage && !refreshing && (
        <View testID="draft_post.load_more_view" style={styles.listFooter}>
          <ActivityIndicator color={colors.gray20} />
        </View>
      )}
      {!refreshing && !hasNextPage && (
        <ViewSpacing height={spacing.margin.large} />
      )}
    </View>
  );

  const renderEmpty = () => (
    <View testID="draft_post.empty_view" style={styles.emptyContainer}>
      <Image source={images.img_empty_draft} style={styles.imgEmpty} />
      <Text.H6 useI18n color={colors.gray50}>
        post:draft:title_no_draft_posts
      </Text.H6>
      <Text useI18n color={colors.gray50}>
        post:draft:text_no_draft_posts
      </Text>
    </View>
  );

  return (
    <FlatList
      testID="draft_post.list"
      style={styles.listContainer}
      data={draftPosts}
      renderItem={renderItem}
      ItemSeparatorComponent={() => (
        <ViewSpacing height={spacing.margin.large} />
      )}
      ListHeaderComponent={() => <ViewSpacing height={spacing.margin.base} />}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshing={refreshing}
      onRefresh={() => getData(true)}
      onEndReached={() => getData(false)}
    />
  );
};

const createStyle = () => StyleSheet.create({
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

export default DraftPost;

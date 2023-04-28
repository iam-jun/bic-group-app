import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, StyleSheet, View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Image from '~/components/Image';

import { useUserIdAuth } from '~/hooks/auth';
import { IPayloadGetDraftContents, PostType } from '~/interfaces/IPost';
import images from '~/resources/images';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import dimension, { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import spacing from '~/theme/spacing';
import useDraftContentsStore from './store';
import DraftArticleView from '../DraftArticle/components/DraftArticleView';
import PostDraftView from '../DraftPost/components/PostDraftView';

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

interface DraftContentsProps {
  onScroll: (e: any) => void;
}

const DraftContents: React.FC<DraftContentsProps> = ({ onScroll }) => {
  const [lossInternet, setLossInternet] = useState(false);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const userId = useUserIdAuth();
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const {
    posts: draftContents = [], hasNextPage, refreshing, actions,
  } = useDraftContentsStore();

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
      const payload: IPayloadGetDraftContents = {
        isRefresh: isRefreshing,
      };
      actions.getDraftContents(payload);
    }
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    getData(false);
  };

  const renderItem = ({ item }: any) => {
    const { type } = item;

    if (type === PostType.POST) {
      return <PostDraftView data={item} />;
    }

    if (type === PostType.ARTICLE) {
      return <DraftArticleView data={item} />;
    }

    return null;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );

  const renderFooter = () => (
    <View>
      {hasNextPage && !refreshing && (
        <View style={styles.listFooter}>
          <ActivityIndicator color={colors.gray20} />
        </View>
      )}
      {!refreshing && !hasNextPage && (
        <ViewSpacing height={spacing.margin.large} />
      )}
    </View>
  );

  const renderEmpty = () => {
    if (hasNextPage) return null;

    return (
      <View style={styles.emptyContainer}>
        <Image source={images.img_empty_draft} style={styles.imgEmpty} />
        <Text.H6 useI18n color={colors.gray50}>
          post:draft:title_no_draft_contents
        </Text.H6>
        <Text useI18n color={colors.gray50}>
          post:draft:text_no_draft_contents
        </Text>
      </View>
    );
  };

  const renderSeparatorComponent = () => (
    <ViewSpacing height={spacing.margin.large} />
  );

  return (
    <Animated.FlatList
      testID="draft_contents.list"
      style={styles.listContainer}
      data={draftContents}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparatorComponent}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gray40}
          progressViewOffset={HeaderFilterHeight}
        />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
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
  header: {
    paddingTop: HeaderFilterHeight,
  },
});

export default DraftContents;

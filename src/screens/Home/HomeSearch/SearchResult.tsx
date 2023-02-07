import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IPayloadGetSearchPosts } from '~/interfaces/IHome';

import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import { scaleSize } from '~/theme/dimension';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Icon from '~/baseComponents/Icon';
import ArticleItem from '~/components/articles/ArticleItem';
import { PostType } from '~/interfaces/IPost';
import { PostView } from '~/components/posts';
import SeriesItem from '~/components/series/SeriesItem';
import FilterToolbar from '~/components/FilterToolbar';
import useFilterToolbarStore from '~/components/FilterToolbar/store';
import useFeedSearchStore from './store';

const SearchResult = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const {
    loadingResult = false,
    searchResults = [],
    searchText = '',
    hasNextPage,
    groupId,
  } = useFeedSearchStore((state) => state.newsfeedSearch);
  const actions = useFeedSearchStore((state) => state.actions);

  const filterCreatedBy = useFilterToolbarStore((state) => state.createdBy);
  const filterDate = useFilterToolbarStore((state) => state.datePosted);

  useEffect(() => {
    getData();
  }, [searchText, filterCreatedBy, filterDate?.startDate, filterDate?.endDate, groupId]);

  const getData = () => {
    if (searchText) {
      const payload: IPayloadGetSearchPosts = {
        searchText,
        actors: filterCreatedBy?.id,
        startDate: filterDate?.startDate,
        endDate: filterDate?.endDate,
        groupId,
      };
      actions.getSearchPosts(payload);
    }
  };

  const onEndReached = () => {
    getData();
  };

  const renderEmpty = () => {
    if (loadingResult || hasNextPage) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Image
          resizeMode="contain"
          style={styles.imgEmpty}
          source={images.img_empty_search_post}
        />
        <Text useI18n style={styles.textEmpty}>
          post:newsfeed:text_empty_search_post
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasNextPage) return <ViewSpacing height={spacing.margin.large} />;

    return (
      <View style={styles.footer}>
        <ActivityIndicator
          color={colors.gray20}
        />
      </View>
    );
  };

  const renderSpacing = () => <ViewSpacing height={spacing.margin.large} />;

  const renderItem = ({ item: data }: any) => {
    if (data?.type === PostType.ARTICLE) {
      return <ArticleItem isLite data={data} />;
    }

    if (data?.type === PostType.SERIES) {
      return <SeriesItem data={data} isLite />;
    }

    return (
      <PostView
        isLite
        data={data}
        pressNavigateToDetail
      />
    );
  };

  return (
    <View style={styles.container}>
      <FilterToolbar />
      <View style={styles.bannerView}>
        <Icon icon="CircleInfo" size={18} tintColor={colors.neutral20} />
        <Text.BodyS color={colors.neutral40} style={styles.bannerText} useI18n>
          home:newsfeed_search:text_banner_search
        </Text.BodyS>
      </View>
      <FlatList
        style={styles.flex1}
        data={searchResults}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderSpacing}
        ItemSeparatorComponent={renderSpacing}
        keyExtractor={(item) => `newsfeed_item_${item?.id}`}
        onEndReached={onEndReached}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral1,
    },
    itemContainer: {
      marginTop: spacing.margin.large,
    },
    imgEmpty: {
      width: scaleSize(240),
      height: scaleSize(160),
      maxWidth: 240,
      maxHeight: 160,
    },
    emptyContainer: {
      alignItems: 'center',
      marginTop: spacing.margin.extraLarge,
    },
    textEmpty: {
      color: colors.gray50,
      textAlign: 'center',
    },
    footer: {
      paddingVertical: spacing.margin.large,
    },
    bannerView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.white,
    },
    bannerText: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
  });
};

export default SearchResult;

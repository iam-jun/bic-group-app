import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import { IPayloadGetSearchPosts } from '~/interfaces/IHome';
import { POST_TYPE } from '~/interfaces/IPost';
import homeKeySelector from '~/storeRedux/home/keySelector';
import homeActions from '~/storeRedux/home/actions';

import PostView from '~/screens/post/components/PostView';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/beinComponents/Text';
import { scaleSize } from '~/theme/dimension';
import FilterToolbar from '~/screens/Home/HomeSearch/FilterToolbar';
import spacing from '~/theme/spacing';
import ArticleItem from '~/screens/articles/components/ArticleItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const SearchResult = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const {
    loadingResult = false,
    searchResults = [],
    searchText = '',
    totalResult,
  } = useKeySelector(homeKeySelector.newsfeedSearchState) || {};
  const filterCreatedBy = useKeySelector(
    homeKeySelector.newsfeedSearchFilterCreatedBy,
  );
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);

  const renderItem = ({ item }: any) => (item.type === POST_TYPE.ARTICLE ? (
    <ArticleItem id={item.id} isLite />
  ) : (
    <PostView
      postId={item?.id}
      isLite
      pressNavigateToDetail
      postData={item}
    />
  ));
  const getData = (isLoadMore = false) => {
    if (searchText) {
      const payload: IPayloadGetSearchPosts = {
        searchText,
        actors: filterCreatedBy?.id,
        startDate: filterDate?.startDate,
        endDate: filterDate?.endDate,
        isLoadMore,
      };
      dispatch(homeActions.getSearchPosts(payload));
    }
  };

  useEffect(() => {
    getData();
  }, [searchText, filterCreatedBy, filterDate?.startDate, filterDate?.endDate]);

  const onEndReached = () => {
    getData(true);
  };

  const renderEmpty = () => {
    if (loadingResult) {
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
    if (totalResult === searchResults.length) return <ViewSpacing height={spacing.margin.large} />;

    return (
      <View style={styles.footer}>
        <ActivityIndicator
          color={colors.gray20}
        />
      </View>
    );
  };

  const renderSpacing = () => <ViewSpacing height={spacing.margin.large} />;

  return (
    <View style={styles.container}>
      <FilterToolbar />
      <FlatList
        style={styles.flex1}
        data={searchResults || []}
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
  });
};

export default SearchResult;

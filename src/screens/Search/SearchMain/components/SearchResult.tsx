import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, ActivityIndicator, ListRenderItem,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Image from '~/components/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import { scaleSize } from '~/theme/dimension';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Icon from '~/baseComponents/Icon';
import useSearchStore from '../../store';
import { PayloadSearchContent } from '~/interfaces/ISearch';
import SearchResultItem from './SearchResultItem';
import { useBaseHook } from '~/hooks';

export type SearchResultProps = {
  searchScreenKey: string;
}

const SearchResult: FC<SearchResultProps> = ({ searchScreenKey }) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const {
    loadingResult = false,
    searchResults = [],
    searchText = '',
    hasNextPage,
    filter,
    totalResults,
  } = useSearchStore((state) => state.search[searchScreenKey]);
  const actionsSearchStore = useSearchStore((state) => state.actions);

  useEffect(() => {
    actionsSearchStore.updateSearchDataByScreenKey(searchScreenKey, {
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });
    getData();
  }, [searchText, filter]);

  const getData = () => {
    const payload: PayloadSearchContent = {
      searchScreenKey,
      searchText,
      contentType: filter?.contentType,
      group: filter?.group,
      isSelectAllInnerGroups: filter?.isSelectAllInnerGroups,
      tags: filter?.tags,
      topics: filter?.topics,
      createdBy: filter?.createdBy,
      datePosted: filter?.datePosted,
    };
    actionsSearchStore.searchContent(payload);
  };

  const onEndReached = () => {
    getData();
  };

  const renderEmpty = () => {
    if (loadingResult || hasNextPage) {
      return null;
    }
    return (
      <View testID="search_result.empty" style={styles.emptyContainer}>
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

  const renderItem: ListRenderItem<string> = ({ item: id }) => (<SearchResultItem id={id} />);

  return (
    <View testID="search_result" style={styles.container}>
      <View style={styles.bannerView}>
        <Text.BodyM color={colors.neutral60}>
          <Text.SubtitleM color={colors.neutral60}>{totalResults || 0}</Text.SubtitleM>
          {` ${t('search:results')}`}
        </Text.BodyM>
        <ViewSpacing height={spacing.margin.tiny} />
        <View style={styles.row}>
          <Icon icon="CircleExclamation" size={16} tintColor={colors.neutral20} />
          <Text.BodyXS color={colors.neutral40} style={styles.bannerText} useI18n>
            search:text_banner_search
          </Text.BodyXS>
        </View>
      </View>
      <FlatList
        style={styles.flex1}
        data={searchResults}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderSpacing}
        ItemSeparatorComponent={renderSpacing}
        keyExtractor={(item) => `search_result_item_${item}`}
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
      marginTop: 2,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.white,
    },
    bannerText: {
      marginLeft: spacing.margin.tiny,
    },
    row: {
      flexDirection: 'row',
    },
  });
};

export default SearchResult;

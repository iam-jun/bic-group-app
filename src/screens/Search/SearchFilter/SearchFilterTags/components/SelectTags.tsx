import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList, ListRenderItem,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import spacing, { padding } from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useSearchFilterTagsStore from '../store';
import ItemCheckbox from '~/components/ItemCheckbox';
import SelectingListInfo from '~/components/SelectingListInfo';
import { SearchInput } from '~/baseComponents/Input';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import Divider from '~/beinComponents/Divider';

const SelectTags = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const selectedTags = useSearchFilterTagsStore((state) => state.selected);
  const data = useSearchFilterTagsStore((state) => state.data);
  const {
    tags = [], loading, key: searchKey, hasNextPage,
  } = data;

  const searchFilterTagsActions = useSearchFilterTagsStore(
    (state) => state.actions,
  );
  const resetStore = useSearchFilterTagsStore((state) => state.reset);

  const getData = (key: string, isRefresh: boolean) => {
    if (key.trim().length >= 3) {
      searchFilterTagsActions.getTags(key, isRefresh);
    }
  };

  useEffect(
    () => () => {
      resetStore();
    },
    [],
  );

  const onSearch = debounce((searchText: string) => {
    getData(searchText, true);
  }, 250);

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(searchKey, false);
    }
  };

  const ListEmptyComponent
    = loading || hasNextPage ? null : <NoSearchResultsFound />;

  const ListHeaderComponent = <ViewSpacing height={padding.small} />;

  const ListFooterComponent = (
    <View style={styles.footer}>
      {loading && (
        <LoadingIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const onAddItem = (tag: string) => {
    const newSelectedTags = [...selectedTags, tag];
    searchFilterTagsActions.updateSelectedTags(newSelectedTags);
  };

  const onRemoveItem = (item: string) => {
    const newSelectedTags = selectedTags.filter(
      (selectedTag) => selectedTag !== item,
    );
    searchFilterTagsActions.updateSelectedTags(newSelectedTags);
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    const isChecked = selectedTags.some(
      (selected) => selected === item,
    );

    return (
      <ItemCheckbox
        data={item}
        isChecked={isChecked}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        testIDCheckbox={`select_tags.item_checkbox_${index}`}
      />
    );
  };

  const keyExtractor = (item: string, index: number) => `tags_list_${item}_${index}`;

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        placeholder={t('search:search_tag_placeholder')}
        onChangeText={onChangeTextSearch}
      />
      <SelectingListInfo
        data={selectedTags}
        type="tags"
        infoMessage={t('search:input_at_least_3_characters')}
        title={t('search:chosen_tag', { number: selectedTags.length })}
        isShowTitle={!!selectedTags.length}
        tagProps={{
          type: 'neutral',
          textProps: {
            numberOfLines: 1,
            style: styles.tagTextStyle,
          },
        }}
        onRemoveItem={onRemoveItem}
      />
      <Divider />
      <FlatList
        data={tags}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
      />
      <KeyboardSpacer iosOnly />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    searchInput: {
      margin: spacing?.margin.large,
    },
    list: {
      paddingHorizontal: padding.large,
    },
    footer: {
      marginTop: spacing.margin.extraLarge,
      marginBottom: spacing.margin.big,
    },
    tagTextStyle: {
      color: colors.neutral60,
      flexShrink: 1,
      paddingLeft: spacing.margin.tiny,
    },
  });
};

export default SelectTags;

import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { isEmpty } from 'lodash';
import { useBaseHook } from '~/hooks';
import spacing, { padding } from '~/theme/spacing';
import ItemCheckbox from '~/components/ItemCheckbox';
import SelectingListInfo from '~/components/SelectingListInfo';
import { SearchInput } from '~/baseComponents/Input';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import Divider from '~/beinComponents/Divider';
import useSelectCategoriesStore from '~/components/SelectCategories/store';
import { ICategory } from '~/interfaces/IArticle';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';

const SelectTopics = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const categoryActions = useSelectCategoriesStore((state) => state.actions);
  const resetStore = useSelectCategoriesStore((state) => state.reset);

  const selectedCategories = useSelectCategoriesStore((state) => state.selected);

  const categoriesData = useSelectCategoriesStore((state) => state.categories);
  const { items: categoryItems, loading: loadingCategories, hasNextPage: hasNextPageCategories } = categoriesData || {};

  const searchData = useSelectCategoriesStore((state) => state.search);
  const {
    key: searchKey, items: searchItems, loading: loadingSearchCategories, hasNextPage: hasNextPageSearchCategories,
  } = searchData || {};

  const listData = searchKey ? searchItems : categoryItems;
  const loadingData = searchKey ? loadingSearchCategories : loadingCategories;
  const hasNextPageData = searchKey ? hasNextPageSearchCategories : hasNextPageCategories;

  useEffect(() => {
    if (isEmpty(categoryItems) && !loadingCategories) {
      categoryActions.getCategories();
    }
  }, [categoriesData]);

  useEffect(
    () => () => {
      resetStore();
    },
    [],
  );

  const onChangeText = debounce((value: string) => {
    categoryActions.getSearchCategories(value);
  }, 500);

  const onLoadMore = debounce(() => {
    categoryActions.getCategories(true);
  }, 200);

  const onAddCategory = (category: ICategory) => {
    const newSelectedCategories = [...selectedCategories, category];
    categoryActions.updateSelectedCategories(newSelectedCategories);
  };

  const onRemoveCategory = (category: ICategory) => {
    const newSelectedCategories = selectedCategories.filter(
      (selectedCategory) => selectedCategory.id !== category.id,
    );
    categoryActions.updateSelectedCategories(newSelectedCategories);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedCategories.some((selected) => selected.id === item.id);
    return (
      <ItemCheckbox
        data={item}
        isChecked={isChecked}
        onAddItem={onAddCategory}
        onRemoveItem={onRemoveCategory}
        testIDCheckbox={`select_topics.item_checkbox_${item.id}`}
      />
    );
  };

  const renderFooter = () => <View style={styles.footer} />;

  const renderListEmptyComponent
    = () => (loadingData || hasNextPageData ? null : <NoSearchResultsFound />);

  const keyExtractor = (item) => `category_item_${item?.name || item?.id}`;

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        placeholder={t('search:search_topic_placeholder')}
        onChangeText={onChangeText}
      />
      <SelectingListInfo
        data={selectedCategories}
        type="tags"
        title={t('search:chosen_topic', { number: selectedCategories.length })}
        isShowTitle={!!selectedCategories.length}
        tagProps={{
          type: 'neutral',
          textProps: {
            numberOfLines: 1,
            style: styles.tagTextStyle,
          },
        }}
        onRemoveItem={onRemoveCategory}
      />
      <Divider />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderListEmptyComponent}
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

export default SelectTopics;

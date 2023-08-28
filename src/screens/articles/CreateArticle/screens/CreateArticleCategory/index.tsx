import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce, isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchInput } from '~/baseComponents/Input';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import ItemCheckbox from '~/components/ItemCheckbox';
import SelectingListInfo from '~/components/SelectingListInfo';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { CreateArticleProps, ICategory } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import spacing from '~/theme/spacing';
import useCreateArticleCategoryStore from './store';

const CreateArticleCategory: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleId = route?.params?.articleId;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const categoryActions = useCreateArticleCategoryStore((state) => state.actions);

  const selectedCategories = useCreateArticleStore((state) => state.data.categories);
  const editArticleActions = useCreateArticleStore((state) => state.actions);

  const categoriesData = useCreateArticleCategoryStore((state) => state.categories);
  const { items: categoryItems, loading: loadingCategories } = categoriesData || {};

  const searchData = useCreateArticleCategoryStore((state) => state.search);
  const { key: searchKey, items: searchItems } = searchData || {};

  const listData = searchKey ? searchItems : categoryItems;

  const {
    handleBack, handleSave, enableButtonSave, loading,
  } = useCreateArticle({ articleId });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  useEffect(() => {
    if (isEmpty(categoryItems) && !loadingCategories) {
      categoryActions.getCategories();
    }
  }, [categoriesData]);

  const onChangeText = debounce((value: string) => {
    categoryActions.getSearchCategories(value);
  }, 500);

  const onLoadMore = debounce(() => {
    categoryActions.getCategories(true);
  }, 200);

  const onAddCategory = (category: ICategory) => {
    editArticleActions.addCategory(category);
  };

  const onRemoveCategory = (category: ICategory) => {
    editArticleActions.removeCategory(category);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedCategories?.findIndex((selected) => selected.id === item.id) > -1;
    return (
      <ItemCheckbox
        data={item}
        isChecked={isChecked}
        onAddItem={onAddCategory}
        onRemoveItem={onRemoveCategory}
      />
    );
  };

  const renderFooter = () => <View style={styles.footer} />;

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_category')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <SearchInput
        style={styles.searchInput}
        placeholder={t('article:text_search_category_placeholder')}
        onChangeText={onChangeText}
      />
      <SelectingListInfo
        type="category"
        data={selectedCategories}
        onRemoveItem={onRemoveCategory}
      />
      <Divider />
      <FlatList
        data={listData || []}
        renderItem={renderItem}
        keyExtractor={(item) => `category_item_${item?.name || item?.id}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={20}
        ListFooterComponent={renderFooter()}
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
      margin: spacing.margin.large,
    },
    footer: {
      marginBottom: spacing.margin.base,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default CreateArticleCategory;

import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { SearchInput } from '~/baseComponents/Input';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { EditArticleProps, ICategory } from '~/interfaces/IArticle';
import CategoryItem from '~/screens/articles/EditArticle/EditCategory/components/CategoryItem';
import SelectingCategory from '~/screens/articles/EditArticle/EditCategory/components/SelectingCategory';
import useEditArticleCategoryStore from '~/screens/articles/EditArticle/EditCategory/store';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import spacing from '~/theme/spacing';

const EditArticleCategory: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const categoryActions = useEditArticleCategoryStore((state) => state.actions);

  const selectedCategories = useEditArticleStore((state) => state.data.categories);
  const editArticleActions = useEditArticleStore((state) => state.actions);

  const categoriesData = useEditArticleCategoryStore((state) => state.categories);
  const { items: categoryItems, loading: loadingCategories } = categoriesData || {};

  const {
    handleSave, handleBack, enableButtonSave, loading,
  } = useEditArticle({ articleId });
  const disabled = !enableButtonSave || loading;

  useEffect(() => {
    if (isEmpty(categoryItems) && !loadingCategories) {
      categoryActions.getCategories();
    }
  }, [categoriesData]);

  useBackPressListener(handleBack);

  const onAddCategory = (category: ICategory) => {
    editArticleActions.addCategory(category);
  };

  const onRemoveCategory = (category: ICategory) => {
    editArticleActions.removeCategory(category);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedCategories.findIndex((selected) => selected.id === item.id) > -1;
    return (
      <CategoryItem
        data={item}
        isChecked={isChecked}
        onAddCategory={onAddCategory}
        onRemoveCategory={onRemoveCategory}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_categories')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <SearchInput
        style={styles.searchInput}
        placeholder={t('article:text_search_category_placeholder')}
      />
      <SelectingCategory />
      <Divider />
      <FlatList
        data={categoryItems || []}
        renderItem={renderItem}
        keyExtractor={(item) => `category_item_${item?.name || item?.id}`}
      />
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
    label: {
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default EditArticleCategory;

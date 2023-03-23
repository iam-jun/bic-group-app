import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce, uniq } from 'lodash';
import React, { FC, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchInput } from '~/baseComponents/Input';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ItemCheckbox from '~/components/ItemCheckbox';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import SelectingListInfo from '~/components/SelectingListInfo';
import useSelectTagsStore from '~/components/SelectTags/store';
import appConfig from '~/configs/appConfig';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import spacing from '~/theme/spacing';

const MAXIMUM_TAGS = 5;

const CreateArticleTags: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleId = route?.params?.articleId;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const article = usePostsStore(postsSelector.getPost(articleId));

  const selectedTags = useCreateArticleStore((state) => state.data?.tags) || [];
  const editArticleActions = useCreateArticleStore((state) => state.actions);

  const communityIds = useSelectTagsStore((state) => state.communityIds) || [];
  const tagsActions = useSelectTagsStore((state) => state.actions);
  const resetTags = useSelectTagsStore((state) => state.reset);
  const tagsData = useSelectTagsStore((state) => state.listTag);
  const { items: tagItems, loading: loadingTags } = tagsData || {};

  const searchData = useSelectTagsStore((state) => state.search);
  const { key: searchKey, items: searchItems, loading: loadingSearchTags } = searchData || {};

  const listData = searchKey ? searchItems : tagItems;

  const {
    handleBack, handleSave, enableButtonSave, loading,
  } = useCreateArticle({ articleId });

  const isValidTags = enableButtonSave && selectedTags?.length <= MAXIMUM_TAGS;
  const disabled = !isValidTags || loading;

  useBackPressListener(handleBack);

  useEffect(() => {
    if (article.audience?.groups?.length > 0) {
      const { groups } = article.audience;
      const ids = [];
      groups.forEach((group: any) => {
        if (group?.rootGroupId) {
          ids.push(group.rootGroupId);
        }
      });
      const newCommunityIds = uniq(ids);
      tagsActions.setCommunityIds(newCommunityIds);
      tagsActions.getTags(false, { groupIds: newCommunityIds });
    } else {
      tagsActions.setListTagLoading(false);
    }
  }, [article.audience]);

  useEffect(() => () => {
    resetTags();
  }, []);

  const onChangeText = debounce((searchText: string) => {
    tagsActions.searchTags({ groupIds: communityIds, name: searchText });
  }, appConfig.searchTriggerTime);

  const onLoadMore = debounce(() => {
    tagsActions.getTags(true, { groupIds: communityIds });
  }, appConfig.searchTriggerTime);

  const onAddItem = (tag) => {
    editArticleActions.addTag(tag);
  };

  const onRemoveItem = (item: any) => {
    editArticleActions.removeTag(item);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedTags.findIndex((selected) => selected?.id === item.id) > -1;
    const disabledCheckbox = (selectedTags?.length === MAXIMUM_TAGS) && !isChecked;

    return (
      <ItemCheckbox
        data={item}
        isChecked={isChecked}
        disabled={disabledCheckbox}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
    );
  };

  const renderFooter = () => <View style={styles.footer} />;

  const renderEmpty = () => {
    if (loadingTags || loadingSearchTags) {
      return <LoadingIndicator style={styles.loading} />;
    }
    return <NoSearchResultsFound />;
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_tags')}
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
        data={selectedTags}
        type="tags"
        infoMessage={t('article:tags_maximum_message_info')}
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
        data={listData || []}
        renderItem={renderItem}
        keyExtractor={(item) => `tags_item_${item?.id || item?.name}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={20}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={renderEmpty()}
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
    label: {
      paddingHorizontal: spacing.padding.large,
    },
    footer: {
      marginBottom: spacing.margin.base,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    tagTextStyle: {
      color: colors.neutral60,
      flexShrink: 1,
      paddingLeft: spacing.margin.tiny,
    },
    loading: {
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default CreateArticleTags;

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce, uniq } from 'lodash';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import appConfig from '~/configs/appConfig';
import { useBaseHook } from '~/hooks';
import { IAudience } from '~/interfaces/IPost';
import { MAXIMUM_TAGS } from '../CreatePost/constanst';
import useCreatePost from '../CreatePost/hooks/useCreatePost';
import useCreatePostStore from '../CreatePost/store';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import Header from '~/beinComponents/Header';
import { SearchInput } from '~/baseComponents/Input';
import Divider from '~/beinComponents/Divider';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import spacing from '~/theme/spacing';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import SelectingListInfo from '~/components/SelectingListInfo';
import ItemCheckbox from '~/components/ItemCheckbox';
import useSelectTagsStore from '~/components/SelectTags/store';

const CreatePostTags = () => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const tempSelectedTags = useCreatePostStore((state) => state.tempData.tags);
  const chosenAudiences = useCreatePostStore(
    (state) => state.createPost.chosenAudiences,
  );
  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const loading = useCreatePostStore((state) => state.loading);

  const communityIds
    = useSelectTagsStore((state) => state.communityIds) || [];
  const tagsActions = useSelectTagsStore((state) => state.actions);
  const resetTags = useSelectTagsStore((state) => state.reset);
  const tagsData = useSelectTagsStore((state) => state.listTag);
  const { items: tagItems, loading: loadingTags } = tagsData || {};

  const searchData = useSelectTagsStore((state) => state.search);
  const {
    key: searchKey,
    items: searchItems,
    loading: loadingSearchTags,
  } = searchData || {};

  const listData = searchKey ? searchItems : tagItems;

  const { saveSelectedTags, enableButtonSaveTags, handleBackWhenSelectingTags } = useCreatePost();

  const disabled = !enableButtonSaveTags || loading;

  useBackPressListener(handleBackWhenSelectingTags);

  useEffect(() => {
    if (chosenAudiences?.length > 0) {
      const groups = chosenAudiences.filter(
        (item: IAudience) => item.type !== 'user',
      );
      const ids = [];
      groups.forEach((group: any) => {
        const id = group?.rootGroupId || group?.id;
        if (id) {
          ids.push(id);
        }
      });
      const newCommunityIds = uniq(ids);
      tagsActions.setCommunityIds(newCommunityIds);
      tagsActions.getTags(false, { groupIds: newCommunityIds });
    } else {
      tagsActions.setListTagLoading(false);
    }
  }, [chosenAudiences]);

  useEffect(
    () => () => {
      resetTags();
      createPostStoreActions.clearTagsTempData();
    },
    [],
  );

  useEffect(() => {
    createPostStoreActions.initTagsTempData();
  }, []);

  const onChangeText = debounce((searchText: string) => {
    tagsActions.searchTags({ groupIds: communityIds, name: searchText });
  }, appConfig.searchTriggerTime);

  const onLoadMore = debounce(() => {
    tagsActions.getTags(true, { groupIds: communityIds });
  }, appConfig.searchTriggerTime);

  const onAddItem = (tag) => {
    createPostStoreActions.addTagToTempData(tag);
  };

  const onRemoveItem = (item: any) => {
    createPostStoreActions.removeTagTempData(item);
  };

  const renderItem = ({ item }) => {
    const isChecked
      = tempSelectedTags.findIndex((selected) => selected?.id === item.id) > -1;
    const disabledCheckbox
      = tempSelectedTags?.length === MAXIMUM_TAGS && !isChecked;

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

  const onPressButtonSave = () => {
    saveSelectedTags();
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_tags')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressButtonSave}
        onPressBack={handleBackWhenSelectingTags}
      />
      <SearchInput
        style={styles.searchInput}
        placeholder={t('article:text_search_category_placeholder')}
        onChangeText={onChangeText}
      />
      <SelectingListInfo
        data={tempSelectedTags}
        type="tags"
        title={t('post:text_selecting_will_be_added_to')}
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

export default CreatePostTags;

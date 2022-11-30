import React, {
  useCallback, useEffect, useMemo,
} from 'react';
import {
  View, StyleSheet, FlatList, ActivityIndicator, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import SearchBaseView, { SearchBaseViewProps } from '~/beinComponents/SearchBaseView';
import appConfig from '~/configs/appConfig';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/baseComponents/Icon';
import useAddArticlesStore, { IAddArticlesState } from './store';
import { IPostArticles } from '~/interfaces/IPost';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/CreateArticle/helper';

interface AddArticlesViewProps extends SearchBaseViewProps {
  audience: any,
  seriesId: string,
  articles: IPostArticles[],
}

const AddArticles = ({
  initSearch,
  audience,
  seriesId,
  articles,
  ...props
}: AddArticlesViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();

  const actions = useAddArticlesStore((state: IAddArticlesState) => state.actions);
  const data = useAddArticlesStore((state: IAddArticlesState) => state.items);
  const loading = useAddArticlesStore((state: IAddArticlesState) => state.loading);
  const hasNextPage = useAddArticlesStore((state: IAddArticlesState) => state.hasNextPage);
  const currentSelectingArticles = useAddArticlesStore((state: IAddArticlesState) => state.selectingArticles);
  const searchKey = useAddArticlesStore((state: IAddArticlesState) => state.key);
  const reset = useAddArticlesStore((state: IAddArticlesState) => state.reset);

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject(audience), [audience],
  );

  useEffect(() => {
    actions.searchArticles({ groupIds: initAudienceIds.groupIds || [], contentSearch: '' });
    const selectingArticles = converArticlesFromArrayToObject(articles);
    actions.setSelectingArticles(selectingArticles);
  }, []);

  useEffect(() => () => { reset(); }, []);

  const getArticlesSearch = (searchText: string) => {
    actions.searchArticles({ groupIds: initAudienceIds.groupIds || [], contentSearch: searchText });
  };

  const onLoadMore = debounce(() => {
    if (hasNextPage) {
      actions.searchArticles({ groupIds: initAudienceIds.groupIds || [], contentSearch: searchKey }, true);
    }
  }, appConfig.searchTriggerTime);

  const searchArticles = (searchQuery: string) => {
    getArticlesSearch(searchQuery);
  };

  const onPressAdd = (isAdded: boolean, item: any) => {
    if (isAdded) return;
    Keyboard.dismiss();
    actions.addArticles(seriesId, item);
  };

  const searchHandler = useCallback(
    debounce(
      searchArticles, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearchArticles = (text: string) => {
    searchHandler(text);
  };

  const renderItem = ({ item }:any) => {
    const isAdded = !!currentSelectingArticles?.[item?.id];
    return (
      <PrimaryItem
        titleProps={{
          variant: 'h4',
          color: colors.neutral60,
        }}
        title={item?.title}
        subTitle={item?.summary}
        style={styles.itemStyles}
        RightComponent={
     (
       <Icon
         testID="article.icon"
         buttonTestID="article.icon.button"
         icon={isAdded ? 'Check' : 'Plus'}
         size={20}
         tintColor={colors.blue50}
         onPress={() => { onPressAdd(isAdded, item); }}
       />
          )
        }
      />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={images.img_empty_search_post}
        description="common:text_search_no_results"
      />
    );
  };

  const renderListFooter = () => {
    if (!loading && hasNextPage && data.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="series.add_articles._search_results.loading_more" />
        </View>
      );
    }

    return null;
  };

  return (
    <SearchBaseView
      {...props}
      onChangeText={onSearchArticles}
    >
      <FlatList
        testID="flatlist"
        data={data}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        keyExtractor={(item) => `search_item_${item?.id}`}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={20}
      />
      <KeyboardSpacer iosOnly />
    </SearchBaseView>
  );
};

const createStyles = () => StyleSheet.create({
  text: {
    marginTop: 33,
    alignItems: 'center',
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyles: {
    alignItems: 'flex-start',
  },
});

const converArticlesFromArrayToObject = (articles : IPostArticles[]) => {
  const result = {};
  articles.forEach((article: IPostArticles) => { result[article.id] = { ...article }; });
  return result;
};

export default AddArticles;

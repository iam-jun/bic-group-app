import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import SelectedAudiences from './components/SelectedAudiences';
import AudienceItem from './components/AudienceItem';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import spacing, { padding } from '~/theme/spacing';
import SearchInput from '../../baseComponents/Input/SearchInput';
import useSelectAudienceStore from './store/index';
import NoSearchResultsFound from '../NoSearchResultsFound';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useMounted from '~/hooks/mounted';
import useGroupTreeStore from '../groups/store';

export enum ContentType {
  POST = 'post',
  ARTICLE = 'article',
  SERIES = 'series',
}

interface SelectAudienceProps {
  contentType: ContentType
}

const SelectAudience = ({ contentType }: SelectAudienceProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const tree = useSelectAudienceStore((state) => state.tree);
  const { data: dataTree = [], loading: loadingTree } = tree || {};

  const search = useSelectAudienceStore((state) => state.search);
  const { data: dataSearch = [], loading: loadingSearch, key: searchKey } = search || {};

  const actions = useSelectAudienceStore((state) => state.actions);
  const resetStore = useSelectAudienceStore((state) => state.reset);

  const selectedAudiences = useSelectAudienceStore((state) => state.selectedAudiences.groups) || {};
  const resetGroupTree = useGroupTreeStore((state) => state.reset);

  const listData: IGroup[] = (!!searchKey ? dataSearch : dataTree) || [];
  const loading = !!searchKey ? loadingSearch : loadingTree;

  useMounted(() => {
    actions.getAudienceTree();
  });

  useEffect(
    () => () => {
      resetGroupTree();
      resetStore();
    }, [],
  );

  const onSearch = debounce(
    (searchText: string) => {
      actions.getAudienceSearch(searchText, contentType);
    }, 500,
  );

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const ListEmptyComponent = loading ? null : <NoSearchResultsFound />;

  const ListHeaderComponent = (<ViewSpacing height={padding.small} />);

  const ListFooterComponent = (
    <View style={styles.footer}>
      {loading && (
      <LoadingIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const renderItemSeperator = () => (!!searchKey && <ViewSpacing height={padding.small} />);

  const onCheckboxPress = useCallback((item: IGroup, isChecked: boolean) => {
    actions.updateItemSelection(item, isChecked);
  }, []);

  const shouldBeChecked = useCallback((child) => !!selectedAudiences?.[child.id], [selectedAudiences]);

  const shouldCheckboxDisabled = useCallback((item) => {
    if (contentType !== ContentType.SERIES) {
      return !searchKey && !item.canCreatePost;
    }

    return !searchKey && !item.canCreateSeries;
  }, [searchKey, contentType]);

  const renderItem = ({ item }) => (
    <AudienceItem
      item={item}
      shouldCheckboxDisabled={shouldCheckboxDisabled}
      shouldBeChecked={shouldBeChecked}
      onCheckboxPress={onCheckboxPress}
    />
  );

  const keyExtractor = (item: IGroup, index: number) => `audience_list_${item?.id}_${index}`;

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        testID="post_select_audience.search"
        placeholder={t('post:search_audiences_placeholder')}
        onChangeText={onChangeTextSearch}
      />
      <SelectedAudiences />
      <FlatList
        data={listData}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={renderItemSeperator}
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
      margin: spacing?.margin.large,
    },
    list: {
      paddingHorizontal: padding.large,
    },
    footer: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.large,
    },
  });
};

export default SelectAudience;

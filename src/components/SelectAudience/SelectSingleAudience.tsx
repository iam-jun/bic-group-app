import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

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
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

const SelectSingleAudience = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const search = useSelectAudienceStore((state) => state.search);
  const {
    data = [],
    loading,
    key: searchKey,
    hasNextPage,
  } = search || {};

  const actions = useSelectAudienceStore((state) => state.actions);
  const resetStore = useSelectAudienceStore((state) => state.reset);

  const selectedAudiences = useSelectAudienceStore((state) => state.selectedAudiences.groups) || {};
  const selectedGroupIds = useSelectAudienceStore((state) => state.selectedIds.groupIds) || [];

  useMounted(() => {
    getData(searchKey, true);
  });

  const getData = (key: string, isRefresh: boolean) => {
    actions.getAllGroupJoinedSearch(key, isRefresh);
  };

  useEffect(
    () => () => {
      resetStore();
    }, [],
  );

  const onSearch = debounce(
    (searchText: string) => {
      getData(searchText, true);
    }, 250,
  );

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(searchKey, false);
    }
  };

  const ListEmptyComponent = (loading || hasNextPage) ? null : <NoSearchResultsFound />;

  const ListHeaderComponent = (<ViewSpacing height={padding.small} />);

  const ListFooterComponent = (
    <View style={styles.footer}>
      {loading && (
      <LoadingIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const onCheckboxPress = (item: IGroup, isChecked: boolean) => {
    if (isChecked) {
      // uncheck all others
      selectedGroupIds.forEach((id) => {
        actions.updateItemSelection(selectedAudiences[id], false);
      });
    }
    actions.updateItemSelection(item, isChecked);
  };

  const shouldBeChecked = useCallback((item) => !!selectedAudiences?.[item.id], [selectedAudiences]);

  const renderItem = ({ item }) => (
    <AudienceItem
      item={item}
      shouldBeChecked={shouldBeChecked}
      onCheckboxPress={onCheckboxPress}
      isSingleSelect
    />
  );

  const keyExtractor = (item: IGroup, index: number) => `audience_list_${item?.id}_${index}`;

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        placeholder={t('post:search_audiences_placeholder')}
        onChangeText={onChangeTextSearch}
      />
      <View style={styles.line} />
      <FlatList
        testID="select_audience.list"
        data={data}
        style={styles.list}
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
    line: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default SelectSingleAudience;

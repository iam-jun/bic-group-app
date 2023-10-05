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
import useSelectAudienceStore, { ContentType } from './store/index';
import NoSearchResultsFound from '../NoSearchResultsFound';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useMounted from '~/hooks/mounted';

interface SelectMultiAudiencesProps {
  contentType: ContentType
}

const SelectMultiAudiences = ({ contentType }: SelectMultiAudiencesProps) => {
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

  useMounted(() => {
    getData(searchKey, contentType, true);
  });

  const getData = (key: string, type: ContentType, isRefresh: boolean) => {
    actions.getAudienceSearch(key, type, isRefresh);
  };

  useEffect(
    () => () => {
      resetStore();
    }, [],
  );

  const onSearch = debounce(
    (searchText: string) => {
      getData(searchText, contentType, true);
    }, 250,
  );

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(searchKey, contentType, false);
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

  const onCheckboxPress = useCallback((item: IGroup, isChecked: boolean) => {
    actions.updateItemSelection(item, isChecked);
  }, []);

  const shouldBeChecked = useCallback((child) => !!selectedAudiences?.[child.id], [selectedAudiences]);

  const renderItem = ({ item }) => (
    <AudienceItem
      item={item}
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
        placeholder={t('post:search_audiences_placeholder')}
        onChangeText={onChangeTextSearch}
      />
      <SelectedAudiences />
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
  });
};

export default SelectMultiAudiences;

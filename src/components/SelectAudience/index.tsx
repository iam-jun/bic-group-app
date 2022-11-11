import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { OnChangeCheckedGroupsData } from '~/beinComponents/GroupTree';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';

import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import SelectingAudiences from './SelectingAudiences';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import SearchInput from '../../baseComponents/Input/SearchInput';
import useSelectAudienceStore from './store/index';

const SelectAudience = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const tree = useSelectAudienceStore((state) => state.tree);
  const { data: dataTree = [], loading: loadingTree } = tree || {};

  const search = useSelectAudienceStore((state) => state.search);
  const { data: dataSearch = [], loading: loadingSearch, key: searchKey } = search || {};

  const actions = useSelectAudienceStore((state) => state.actions);

  const selectingGroups = useSelectAudienceStore((state) => state.selecting.groups) || {};

  const listData: IGroup[] = (!!searchKey ? dataSearch : dataTree) || [];
  const loading = !!searchKey ? loadingSearch : loadingTree;

  useEffect(() => {
    actions.getAudienceTree();
  }, []);

  const onSearch = debounce(
    (searchText: string) => {
      actions.getAudienceSearch(searchText);
    }, 500,
  );

  const onChangeCheckedGroups = (data: OnChangeCheckedGroupsData) => {
    actions.setSelectingGroups({ ...selectingGroups, ...data });
  };

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      groupItemTestID="post_select_audience.groups.item"
      initShowTree={!searchKey}
      checkboxDisabled={!searchKey && !item.isPostable} // api search return all groups user can post to
      disableOnPressItem={!item.isPostable}
      hidePath
      groupStyle={{ paddingVertical: spacing.padding.small }}
      showPrivacyAvatar
      selectingData={selectingGroups}
      onChangeCheckedGroups={onChangeCheckedGroups}
    />
  );

  const renderListFooter = () => (
    <View style={{ marginBottom: spacing.margin.large }}>
      {loading && (
        <ActivityIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return <NoSearchResultsFound />;
  };

  return (
    <View style={styles.container}>
      <SearchInput
        size="large"
        style={styles.searchInput}
        testID="post_select_audience.search"
        onChangeText={onChangeTextSearch}
        placeholder={t('post:search_audiences_placeholder')}
      />
      <SelectingAudiences />
      <FlatList
        style={{ paddingHorizontal: spacing?.padding.large }}
        data={listData}
        keyExtractor={(
          item, index,
        ) => item?.id || `section_list_${item}_${index}`}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
    },
    searchInput: {
      margin: spacing?.margin.large,
    },
  });
};

export default SelectAudience;

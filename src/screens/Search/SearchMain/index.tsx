import React, {
  FC, useEffect, useLayoutEffect,
} from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import SearchHeader from './components/SearchHeader';
import SearchSuggestion from './components/SearchSuggestion';
import SearchResult from './components/SearchResult';
import { ITag } from '~/interfaces/ITag';
import { IGroup } from '~/interfaces/IGroup';
import useSearchStore from '../store';
import {
  ISearchFilter,
  ITagSearch,
  UpdateSearchData,
} from '~/interfaces/ISearch';
import { useRootNavigation } from '~/hooks/navigation';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';
import { useBaseHook } from '~/hooks';
import { getNumberActiveFilters } from './helper';

type SearchMainProps = {
  route: {
    key: string;
    params: {
      tag?: ITag;
      group?: IGroup;
    };
  };
};

const SearchMain: FC<SearchMainProps> = ({ route }) => {
  const { key } = route || {};
  const { tag, group } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const isAutoFocus = !tag;

  const actionsSearchStore = useSearchStore((state) => state.actions);

  const hasData = useSearchStore((state) => !!state.search[key]);
  const isSuggestion = useSearchStore(
    (state) => state.search[key]?.isSuggestion,
  );
  const searchText = useSearchStore((state) => state.search[key]?.searchText);
  const filter = useSearchStore((state) => state.search[key]?.filter);

  const numberActiveFilters = getNumberActiveFilters(filter);

  useLayoutEffect(() => {
    actionsSearchStore.initSearchDataByScreenKey(key);

    if (!!tag || !!group) {
      const searchFilter: ISearchFilter = {};
      if (!!tag) {
        const searchTag: ITagSearch = {
          ids: [tag.id],
          name: tag.name,
        };
        searchFilter.tags = [searchTag];
      }
      if (!!group) {
        searchFilter.group = group;
        searchFilter.isSelectAllInnerGroups = true;
      }

      const searchData: UpdateSearchData = {
        isSuggestion: !tag,
        filter: searchFilter,
      };
      actionsSearchStore.updateSearchDataByScreenKey(key, searchData);
    }
  }, []);

  useEffect(
    () => () => actionsSearchStore.removeSearchDataByScreenKey(key),
    [],
  );

  const onPressFilter = () => {
    rootNavigation.navigate(searchStack.searchFilterMain, {
      searchScreenKey: key,
    });
  };

  const onPressBack = () => {
    rootNavigation.goBack();
  };

  const onChangeText = (searchText: string) => {
    actionsSearchStore.updateSearchDataByScreenKey(key, {
      searchText,
      isSuggestion: true,
    });
  };

  const onFocusSearchInput = () => {
    actionsSearchStore.updateSearchDataByScreenKey(key, {
      isSuggestion: true,
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });
  };

  const onSubmitSearchInput = () => {
    actionsSearchStore.updateSearchDataByScreenKey(key, {
      isSuggestion: false,
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });
  };

  const renderContent = () => (!hasData ? null : isSuggestion ? (
    <SearchSuggestion searchScreenKey={key} />
  ) : (
    <SearchResult searchScreenKey={key} />
  ));

  return (
    <View style={styles.container}>
      <SearchHeader
        onPressBack={onPressBack}
        onPressFilter={onPressFilter}
        searchText={searchText}
        placeholder={t('input:search_content')}
        onChangeText={onChangeText}
        onFocus={onFocusSearchInput}
        onSubmitEditing={onSubmitSearchInput}
        autoFocus={isAutoFocus}
        numberActiveFilters={numberActiveFilters}
      />
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};

export default SearchMain;

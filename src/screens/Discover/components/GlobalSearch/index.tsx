import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import SearchBaseView, { SearchBaseViewProps } from '~/beinComponents/SearchBaseView';
import Text from '~/beinComponents/Text';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import GlobalSearchResults from './components/GlobalSearchResults';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';

interface GlobalSearchProps extends SearchBaseViewProps {
  onPressCommunity: (id: string) => void;
}

const GlobalSearch = ({
  initSearch,
  onPressCommunity,
  ...props
}: GlobalSearchProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();

  const { canLoadMore } = useKeySelector(groupsKeySelector.globalSearch);

  const getGlobalSearch = (searchText: string) => {
    if (!searchText) return;

    dispatch(actions.getGlobalSearch(searchText));
  };

  const onLoadMore = () => {
    canLoadMore && getGlobalSearch(searchText);
  };

  const doGlobalSearch = (searchQuery: string) => {
    dispatch(actions.resetGlobalSearch());
    setSearchText(searchQuery);
    getGlobalSearch(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(
      doGlobalSearch, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearch = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      {...props}
      onChangeText={onSearch}
    >
      {searchText ? (
        <GlobalSearchResults
          onLoadMore={onLoadMore}
          onPressCommunity={onPressCommunity}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.gray50}
            testID="search_community_view.type_search"
            useI18n
          >
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

const createStyles = () => StyleSheet.create({
  text: {
    marginTop: 33,
    alignItems: 'center',
  },
});

export default GlobalSearch;

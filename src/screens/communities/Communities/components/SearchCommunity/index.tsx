import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import SearchBaseView, { SearchBaseViewProps } from '~/beinComponents/SearchBaseView';
import Text from '~/baseComponents/Text';
import appConfig from '~/configs/appConfig';
import CommunitySearchResults from './CommunitySearchResults';
import useSearchJoinedCommunitiesStore from './store';

type SearchCommunityViewProps = SearchBaseViewProps

const SearchCommunity = ({
  initSearch,
  ...props
}: SearchCommunityViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();

  const { hasNextPage, reset, actions } = useSearchJoinedCommunitiesStore();

  const getCommunitySearch = (searchText: string) => {
    actions.searchJoinedCommunities({ key: searchText });
  };

  const onLoadMore = () => {
    hasNextPage && getCommunitySearch(searchText);
  };

  const searchCommunities = (searchQuery: string) => {
    reset();
    setSearchText(searchQuery);
    getCommunitySearch(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(
      searchCommunities, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearchCommunities = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      {...props}
      onChangeText={onSearchCommunities}
    >
      {searchText ? (
        <CommunitySearchResults
          onLoadMore={onLoadMore}
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

export default SearchCommunity;

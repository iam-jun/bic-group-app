import {View, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {debounce} from 'lodash';

import SearchBaseView from '~/beinComponents/SearchBaseView';
import Text from '~/beinComponents/Text';
import actions from '~/screens/Groups/redux/actions';
import appConfig from '~/configs/appConfig';
import CommunitySearchResults from './CommunitySearchResults';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';

interface SearchCommunityViewProps {
  isOpen: boolean;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onPressCommunity: (id: number) => void;
}

const SearchCommunityView = ({
  isOpen,
  placeholder,
  initSearch,
  onClose,
  onPressCommunity,
}: SearchCommunityViewProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ExtendedTheme;
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();

  const {canLoadMore} = useKeySelector(groupsKeySelector.communitySearch);

  const getCommunitySearch = (searchText: string) => {
    dispatch(actions.getCommunitySearch({key: searchText}));
  };

  const onLoadMore = () => {
    canLoadMore && getCommunitySearch(searchText);
  };

  const searchCommunities = (searchQuery: string) => {
    dispatch(actions.resetCommunitySearch());
    setSearchText(searchQuery);
    getCommunitySearch(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(searchCommunities, appConfig.searchTriggerTime),
    [],
  );

  const onSearchCommunities = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      isOpen={isOpen}
      placeholder={placeholder}
      onClose={onClose}
      onChangeText={onSearchCommunities}>
      {!!searchText ? (
        <CommunitySearchResults
          onLoadMore={onLoadMore}
          onPressCommunity={onPressCommunity}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.gray50}
            testID="search_community_view.type_search"
            useI18n>
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    text: {
      marginTop: 33,
      alignItems: 'center',
    },
  });
};

export default SearchCommunityView;

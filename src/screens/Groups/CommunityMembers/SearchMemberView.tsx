import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import actions from '~/screens/Groups/redux/actions';
import {debounce} from 'lodash';
import appConfig from '~/configs/appConfig';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import SearchResultContent from './SearchResultContent';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';

interface SearchMemberViewProps {
  communityId: number;
  isOpen: boolean;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
}

const SearchMemberView = ({
  communityId,
  isOpen,
  placeholder,
  onClose,
  initSearch,
}: SearchMemberViewProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();
  const {can_manage_member} = useKeySelector(groupsKeySelector.communityDetail);

  const getCommunitySearchMembers = (searchText: string) => {
    dispatch(
      actions.getCommunitySearchMembers({
        communityId,
        params: {key: searchText},
      }),
    );
  };

  const onLoadMore = () => {
    getCommunitySearchMembers(searchText);
  };

  const searchMember = (searchQuery: string) => {
    dispatch(actions.resetCommunitySearchMembers());
    setSearchText(searchQuery);
    getCommunitySearchMembers(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(searchMember, appConfig.searchTriggerTime),
    [],
  );

  const onSearchMember = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      isOpen={isOpen}
      placeholder={placeholder}
      onClose={onClose}
      onChangeText={onSearchMember}>
      {!!searchText ? (
        <SearchResultContent
          canManageMember={can_manage_member}
          onLoadMore={onLoadMore}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.textSecondary}
            testID="search_member_modal.type_search"
            useI18n>
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

export default SearchMemberView;

const createStyles = () => {
  return StyleSheet.create({
    text: {
      marginTop: 33,
      alignItems: 'center',
    },
  });
};

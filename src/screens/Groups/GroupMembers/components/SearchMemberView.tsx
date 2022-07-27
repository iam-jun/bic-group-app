import { StyleSheet, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import actions from '~/screens/Groups/redux/actions';
import appConfig from '~/configs/appConfig';
import Text from '~/beinComponents/Text';
import { IGroupMembers } from '~/interfaces/IGroup';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import MemberSearchResult from '../../components/MemberSearchResult';

interface SearchMemberViewProps {
  groupId: string;
  isOpen: boolean;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onPressMenu: (item: IGroupMembers) => void;
}

const SearchMemberView = ({
  isOpen,
  groupId,
  placeholder,
  initSearch,
  onClose,
  onPressMenu,
}: SearchMemberViewProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles(theme);
  const canManageMember = useKeySelector(
    groupsKeySelector.groupDetail.canManageMember,
  );
  const groupSearchMembers = useKeySelector(
    groupsKeySelector.groupSearchMembers,
  );

  const getGroupSearchMembers = (searchText: string) => {
    dispatch(actions.getGroupSearchMembers({ groupId, params: { key: searchText } }));
  };

  const onLoadMore = () => {
    getGroupSearchMembers(searchText);
  };

  const searchMembers = (searchQuery: string) => {
    dispatch(actions.clearGroupSearchMembers());
    setSearchText(searchQuery);
    getGroupSearchMembers(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(
      searchMembers, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearchMembers = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      isOpen={isOpen}
      placeholder={placeholder}
      onClose={onClose}
      onChangeText={onSearchMembers}
    >
      {searchText ? (
        <MemberSearchResult
          canManageMember={canManageMember}
          memberSearchData={groupSearchMembers}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.gray50}
            testID="search_member_view.type_search"
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

export default SearchMemberView;

import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';

import actions from '~/screens/Groups/redux/actions';
import {debounce} from 'lodash';
import appConfig from '~/configs/appConfig';
import Text from '~/beinComponents/Text';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {IGroupMembers} from '~/interfaces/IGroup';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import MemberSearchResult from '../../components/MemberSearchResult';

interface SearchMemberViewProps {
  groupId: number;
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
  const theme = useTheme() as ExtendedTheme;
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles(theme);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const groupSearchMembers = useKeySelector(
    groupsKeySelector.groupSearchMembers,
  );

  const getGroupSearchMembers = (searchText: string) => {
    dispatch(
      actions.getGroupSearchMembers({groupId, params: {key: searchText}}),
    );
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
    debounce(searchMembers, appConfig.searchTriggerTime),
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
      onChangeText={onSearchMembers}>
      {!!searchText ? (
        <MemberSearchResult
          canManageMember={can_manage_member}
          memberSearchData={groupSearchMembers}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.gray50}
            testID="search_member_view.type_search"
            useI18n>
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  return StyleSheet.create({
    text: {
      marginTop: 33,
      alignItems: 'center',
    },
  });
};

export default SearchMemberView;

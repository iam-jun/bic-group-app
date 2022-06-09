import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import actions from '~/screens/Groups/redux/actions';
import {debounce} from 'lodash';
import appConfig from '~/configs/appConfig';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import SearchResultContent from './SearchResultContent';
import {IGroupMembers} from '~/interfaces/IGroup';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';

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
  const theme = useTheme() as ITheme;
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles(theme);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
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
        <SearchResultContent
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
          canManageMember={can_manage_member}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.textSecondary}
            testID="search_member_view.type_search"
            useI18n>
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    text: {
      marginTop: 33,
      alignItems: 'center',
    },
  });
};

export default SearchMemberView;

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
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import MemberSearchResult from '../components/MemberSearchResult';

interface SearchMemberViewProps {
  communityId: number;
  isOpen: boolean;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onPressMenu: (item: ICommunityMembers) => void;
}

const SearchMemberView = ({
  communityId,
  isOpen,
  placeholder,
  initSearch,
  onClose,
  onPressMenu,
}: SearchMemberViewProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();
  const {can_manage_member} = useKeySelector(groupsKeySelector.communityDetail);
  const communitySearchMembers = useKeySelector(
    groupsKeySelector.communitySearchMembers,
  );

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
        <MemberSearchResult
          canManageMember={can_manage_member}
          memberSearchData={communitySearchMembers}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
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

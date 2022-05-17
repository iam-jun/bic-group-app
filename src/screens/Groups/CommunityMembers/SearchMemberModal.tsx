import {StyleSheet, View} from 'react-native';
import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import SearchBaseModal from '~/beinComponents/modals/SearchBaseModal';
import actions from '~/screens/Groups/redux/actions';
import {debounce} from 'lodash';
import appConfig from '~/configs/appConfig';
import ContentData from './ContentData';
import groupsKeySelector from '../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';

interface SearchMemberModalProps {
  communityId: number;
  isOpen: boolean;
  placeholder?: string;
  onPressChat?: () => void;
  onClose?: () => void;
}

const SearchMemberModal = ({
  communityId,
  isOpen,
  placeholder,
  onPressChat,
  onClose,
}: SearchMemberModalProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const [searchText, setSearchText] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const styles = createStyles(theme);

  const {loading, canLoadMore, communityAdmins, members} = useKeySelector(
    groupsKeySelector.searchMembers,
  );

  useEffect(() => {
    const newSectionList: any = [
      {
        title: 'Admins',
        data: communityAdmins.data,
        total: communityAdmins.total,
      },
      {
        title: 'Members',
        data: members.data,
        total: members.total,
      },
    ];

    setSectionList(newSectionList);
  }, [communityAdmins.data, members.data]);

  const getSearchMembers = (searchText: string) => {
    dispatch(
      actions.getSearchMembers({communityId, params: {key: searchText}}),
    );
  };

  const onLoadMore = () => {
    getSearchMembers(searchText);
  };

  const searchMember = (searchQuery: string) => {
    dispatch(actions.resetSearchMembers());
    setSearchText(searchQuery);
    getSearchMembers(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(searchMember, appConfig.searchTriggerTime),
    [],
  );

  const onSearchMember = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseModal
      isOpen={isOpen}
      placeholder={placeholder}
      onClose={onClose}
      onChangeText={onSearchMember}>
      {!!searchText ? (
        <ContentData
          keyId={'searchmembers'}
          sectionList={sectionList}
          loading={loading}
          canLoadMore={canLoadMore}
          onLoadMore={onLoadMore}
          onPressChat={onPressChat}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS color={theme.colors.textSecondary} useI18n>
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseModal>
  );
};

export default SearchMemberModal;

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    text: {
      marginTop: 33,
      alignItems: 'center',
    },
  });
};

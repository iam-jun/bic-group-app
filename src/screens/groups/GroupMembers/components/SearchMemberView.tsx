import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import { IGroupMembers } from '~/interfaces/IGroup';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import MemberSearchResult from '../../components/MemberSearchResult';
import { useMyPermissions } from '~/hooks/permissions';

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
  const [searchText, setSearchText] = useState(initSearch || '');
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    [
      PERMISSION_KEY.GROUP.ADD_REMOVE_GROUP_MEMBER,
      PERMISSION_KEY.GROUP.ASSIGN_UNASSIGN_ROLE_IN_GROUP,
    ],
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
      {!!searchText && (
        <MemberSearchResult
          canManageMember={canManageMember}
          memberSearchData={groupSearchMembers}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      )}
    </SearchBaseView>
  );
};

export default SearchMemberView;

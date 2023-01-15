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
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';

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
  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canManageMember = shouldHavePermission(
    groupId,
    [
      PermissionKey.REMOVE_MEMBER,
      PermissionKey.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const groupSearchMembers = useKeySelector(
    groupsKeySelector.groupSearchMembers,
  );

  const getGroupSearchMembers = (searchText: string) => {
    if (!searchText?.trim?.()) return;

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
      {!!searchText?.trim?.() && (
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

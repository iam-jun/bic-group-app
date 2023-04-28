import React, { useCallback } from 'react';

import { debounce } from 'lodash';
import appConfig from '~/configs/appConfig';
import { IGroupMembers } from '~/interfaces/IGroup';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import MemberSearchResult from '../../components/MemberSearchResult';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupMemberStore from '../store';

interface SearchMemberViewProps {
  groupId: string;
  isOpen: boolean;
  placeholder?: string;
  onClose?: () => void;
  onPressMenu: (item: IGroupMembers) => void;
}

const SearchMemberView = ({
  isOpen,
  groupId,
  placeholder,
  onClose,
  onPressMenu,
}: SearchMemberViewProps) => {
  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canManageMember = shouldHavePermission(
    groupId,
    [
      PermissionKey.REMOVE_MEMBER,
      PermissionKey.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const isAdminRole = shouldHavePermission(
    groupId,
    [
      PermissionKey.ROLE_COMMUNITY_OWNER,
      PermissionKey.ROLE_COMMUNITY_ADMIN,
      PermissionKey.ROLE_GROUP_ADMIN,
    ],
  );

  const actions = useGroupMemberStore((state) => state.actions);
  const searchText = useGroupMemberStore((state) => state.search.key);
  const groupSearchMembers = useGroupMemberStore((state) => state.search);

  const getGroupSearchMembers = (searchQuery: string) => {
    if (!searchQuery?.trim?.()) return;

    actions.getGroupSearchMembers({ groupId, params: { key: searchQuery } });
  };

  const onLoadMore = () => {
    getGroupSearchMembers(searchText);
  };

  const searchMembers = (searchQuery: string) => {
    actions.clearGroupSearchMembers();
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
          isAdminRole={isAdminRole}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      )}
    </SearchBaseView>
  );
};

export default SearchMemberView;

import React, { useCallback, useState } from 'react';

import { debounce } from 'lodash';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import appConfig from '~/configs/appConfig';
import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberSearchResult from '../../../../groups/components/MemberSearchResult';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useCommunityMemberStore from '../../store';

interface SearchMemberViewProps {
  community: ICommunity;
  isOpen: boolean;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onPressMenu: (item: ICommunityMembers) => void;
}

const SearchMemberView = ({
  community,
  isOpen,
  placeholder,
  initSearch,
  onClose,
  onPressMenu,
}: SearchMemberViewProps) => {
  const actions = useCommunityMemberStore((state) => state.actions);
  const communitySearchMembers = useCommunityMemberStore((state) => state.search);

  const [searchText, setSearchText] = useState(initSearch || '');

  const { groupId, id } = community;
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

  const getCommunitySearchMembers = (searchText: string, isLoadMore?:boolean) => {
    if (!searchText?.trim?.()) return;
    actions.searchCommunityMembers({ key: searchText, groupId, isLoadMore });
  };

  const onLoadMore = () => {
    getCommunitySearchMembers(searchText, true);
  };

  const searchMember = (searchQuery: string) => {
    setSearchText(searchQuery);
    getCommunitySearchMembers(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(
      searchMember, appConfig.searchTriggerTime,
    ),
    [searchMember],
  );

  const onSearchMember = (text: string) => {
    searchHandler(text);
  };

  return (
    <SearchBaseView
      isOpen={isOpen}
      placeholder={placeholder}
      onClose={onClose}
      onChangeText={onSearchMember}
    >
      {!!searchText?.trim?.() && (
        <MemberSearchResult
          canManageMember={canManageMember}
          communityId={id}
          memberSearchData={communitySearchMembers}
          isAdminRole={isAdminRole}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      )}
    </SearchBaseView>
  );
};

export default SearchMemberView;

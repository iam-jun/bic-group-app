import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import MemberSearchResult from '../../../../groups/components/MemberSearchResult';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';

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
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(initSearch || '');

  const { groupId } = community;
  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canManageMember = shouldHavePermission(
    groupId,
    [
      PermissionKey.REMOVE_MEMBER,
      PermissionKey.ASSIGN_UNASSIGN_ROLE,
    ],
  );
  const communitySearchMembers = useKeySelector(
    groupsKeySelector.communitySearchMembers,
  );

  const getCommunitySearchMembers = (searchText: string) => {
    if (!searchText?.trim?.()) return;

    dispatch(actions.getCommunitySearchMembers({
      groupId,
      params: { key: searchText },
    }));
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
    debounce(
      searchMember, appConfig.searchTriggerTime,
    ),
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
      onChangeText={onSearchMember}
    >
      {!!searchText?.trim?.() && (
        <MemberSearchResult
          canManageMember={canManageMember}
          memberSearchData={communitySearchMembers}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      )}
    </SearchBaseView>
  );
};

export default SearchMemberView;

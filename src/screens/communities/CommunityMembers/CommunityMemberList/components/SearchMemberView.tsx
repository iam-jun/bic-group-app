import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import SearchBaseView from '~/beinComponents/SearchBaseView';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import MemberSearchResult from '../../../../groups/components/MemberSearchResult';
import { useMyPermissions } from '~/hooks/permissions';

interface SearchMemberViewProps {
  communityId: string;
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
  const [searchText, setSearchText] = useState(initSearch || '');
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
      PERMISSION_KEY.COMMUNITY.ASSIGN_UNASSIGN_ROLE_IN_COMMUNITY,
    ],
  );
  const communitySearchMembers = useKeySelector(
    groupsKeySelector.communitySearchMembers,
  );

  const getCommunitySearchMembers = (searchText: string) => {
    dispatch(actions.getCommunitySearchMembers({
      communityId,
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
      {!!searchText && (
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

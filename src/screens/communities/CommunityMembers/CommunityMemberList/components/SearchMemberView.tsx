import React, { useCallback, useRef, useState } from 'react';

import { debounce } from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import appConfig from '~/configs/appConfig';
import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useCommunityMemberStore from '../../store';
import { SearchInput } from '~/baseComponents/Input';
import { dimension, spacing } from '~/theme';
import { fontFamilies } from '~/theme/fonts';
import MemberSearchResult from '~/screens/groups/components/MemberSearchResult';
import CommunityMemberList from '../index';

interface SearchMemberViewProps {
  community: ICommunity;
  placeholder: string;
  isMember: boolean;
  onPressMenu: (item: ICommunityMembers) => void;
}

const SearchMemberView = ({
  community, placeholder, isMember, onPressMenu,
}: SearchMemberViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const textInputRef = useRef(null);

  const actions = useCommunityMemberStore((state) => state.actions);
  const communitySearchMembers = useCommunityMemberStore((state) => state.search);

  const [searchText, setSearchText] = useState('');

  const { groupId, id } = community;
  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canManageMember = shouldHavePermission(groupId, [
    PermissionKey.REMOVE_MEMBER,
    PermissionKey.ASSIGN_UNASSIGN_ROLE,
  ]);
  const isAdminRole = shouldHavePermission(groupId, [
    PermissionKey.ROLE_COMMUNITY_OWNER,
    PermissionKey.ROLE_COMMUNITY_ADMIN,
    PermissionKey.ROLE_GROUP_ADMIN,
  ]);

  const getCommunitySearchMembers = (searchText: string, isLoadMore?: boolean) => {
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

  const searchHandler = useCallback(debounce(searchMember, appConfig.searchTriggerTime), [groupId]);

  const onSearchMember = (text: string) => {
    searchHandler(text);
  };

  const renderSearchInput = () => {
    if (isMember) {
      return (
        <View style={styles.inputIconContainer}>
          <SearchInput
            inputRef={textInputRef}
            style={styles.textInput}
            value={searchText}
            autoComplete="off"
            placeholder={placeholder}
            placeholderTextColor={theme.colors.gray40}
            selectionColor={theme.colors.gray50}
            onChangeText={onSearchMember}
            size="large"
          />
        </View>
      );
    }
    return null;
  };

  const renderMemberList = () => {
    if (!!searchText?.trim?.()) {
      return (
        <MemberSearchResult
          canManageMember={canManageMember}
          communityId={id}
          memberSearchData={communitySearchMembers}
          isAdminRole={isAdminRole}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      );
    }
    return <CommunityMemberList community={community} onPressMenu={onPressMenu} />;
  };

  return (
    <View style={styles.container} testID="search_member_view">
      {renderSearchInput()}
      {renderMemberList()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    inputIconContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
    },
    textInput: {
      height: '100%',
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyS,
      color: colors.neutral20,
    },
    iconClose: {
      marginRight: spacing.margin.large,
    },
  });
};

export default SearchMemberView;

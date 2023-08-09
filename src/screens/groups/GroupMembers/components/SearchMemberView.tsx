import React, { useCallback, useRef } from 'react';

import { debounce } from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import appConfig from '~/configs/appConfig';
import { IGroupMembers } from '~/interfaces/IGroup';
import MemberSearchResult from '../../components/MemberSearchResult';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupMemberStore from '../store';
import { SearchInput } from '~/baseComponents/Input';
import GroupMemberList from '../GroupMemberList';
import { dimension, spacing } from '~/theme';
import { fontFamilies } from '~/theme/fonts';

interface SearchMemberViewProps {
  groupId: string;
  placeholder: string;
  isMemberCommunity: boolean;
  onPressMenu: (item: IGroupMembers) => void;
}

const SearchMemberView = ({
  groupId,
  placeholder,
  isMemberCommunity,
  onPressMenu,
}: SearchMemberViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const textInputRef = useRef(null);

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
    [groupId],
  );

  const onSearchMembers = (text: string) => {
    searchHandler(text);
  };

  const renderSearchInput = () => {
    if (isMemberCommunity) {
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
            onChangeText={onSearchMembers}
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
          memberSearchData={groupSearchMembers}
          isAdminRole={isAdminRole}
          onLoadMore={onLoadMore}
          onPressMenu={onPressMenu}
        />
      );
    }
    return <GroupMemberList groupId={groupId} onPressMenu={onPressMenu} />;
  };

  return (
    <View style={styles.container}>
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

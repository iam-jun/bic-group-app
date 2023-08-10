import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import { debounce } from 'lodash';
import Text from '~/baseComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import { Button } from '~/baseComponents';
import { dimension } from '~/theme';
import useModalStore from '~/store/modal';
import { SearchInput } from '~/baseComponents/Input';
import { fontFamilies } from '~/theme/fonts';
import appConfig from '~/configs/appConfig';
import SelectedPeople from './components/SelectedPeople';
import SearchResults from './components/SearchResults';
import useGroupJoinableUsersStore from './store';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { InvitationsTargetType, IParamsInvitations } from '~/interfaces/IGroup';
import TextSelectedPeople from './components/TextSelectedPeople';
import { ITypeGroup } from '~/interfaces/common';

interface InvitePeopleToYourGroupProps {
  groupId: string;
  type: ITypeGroup;
}

export const WARNING_SECTION = {
  WARNING: 18,
  MAX: 20,
};

const InvitePeopleToYourGroup = (props: InvitePeopleToYourGroupProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyle(theme);

  const { groupId, type } = props;

  const { hideModal } = useModalStore((state) => state.actions);
  const {
    data, selectedUsers, loading, actions, searchText,
  } = useGroupJoinableUsersStore((state) => state);

  const shouldDisableButton = selectedUsers.length === 0;

  const getData = (key: string, isLoadMore = false) => {
    actions.getGroupJoinableUsers({ groupId, key, isLoadMore });
  };

  const onLoadMore = () => {
    getData(searchText, true);
  };

  const searchUsers = (searchQuery: string) => {
    actions.setSearchText(searchQuery);
    if (!searchQuery.trim()) return;
    getData(searchQuery);
  };

  const searchHandler = useCallback(debounce(searchUsers, appConfig.searchTriggerTime), []);

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const onPressInvite = () => {
    const params: IParamsInvitations = {
      targetId: groupId,
      targetType: InvitationsTargetType.GROUP,
      inviteeIds: selectedUsers,
      onSuccess,
      onError,
    };
    actions.invitations(params);
  };

  const onSuccess = () => {
    hideModal();
    actions.getInvitations(groupId, true);
  };

  const onError = () => {
    hideModal();
  };

  const onSelectUser = (userId: string) => {
    actions.setSelectedUsers(userId);
  };

  const renderSearchResults = () => {
    if (!!searchText.trim()) {
      return (
        <View style={styles.searchResults}>
          <SearchResults
            data={data}
            selectedUsers={selectedUsers}
            onLoadMore={onLoadMore}
            onSelectUser={onSelectUser}
            loading={loading}
          />
        </View>
      );
    }
    return (
      <View style={styles.searchResults}>
        <ViewSpacing height={dimension.heightListInModal} />
      </View>
    );
  };

  return (
    <ScreenWrapper style={styles.container} testID="invite_people_to_your_group">
      <Text.H3 style={styles.title} useI18n>
        {t(`common:text_invite_people_to_your_${type}`)}
      </Text.H3>
      <TextSelectedPeople selectedUsers={selectedUsers} loading={loading} />
      <View style={styles.inputIconContainer}>
        <SearchInput
          editable={!loading}
          value={searchText}
          autoComplete="off"
          placeholder={t('common:text_search_for_people')}
          placeholderTextColor={theme.colors.gray40}
          selectionColor={theme.colors.gray50}
          onChangeText={onQueryChanged}
          maxLength={64}
        />
      </View>
      <SelectedPeople data={data} selectedUsers={selectedUsers} loading={loading} onSelectUser={onSelectUser} />
      {renderSearchResults()}
      <Button.Primary
        testID="invite_people_to_your_group.btn_invite"
        style={styles.button}
        onPress={onPressInvite}
        useI18n
        size="large"
        disabled={shouldDisableButton}
        loading={loading}
      >
        common:text_invite
      </Button.Primary>
    </ScreenWrapper>
  );
};

const themeStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    title: {
      marginTop: spacing.margin.large,
    },
    inputIconContainer: {
      marginTop: spacing.margin.large,
    },
    textInput: {
      height: '100%',
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyS,
      color: colors.neutral20,
    },
    button: {
      marginTop: spacing.margin.large,
    },
    searchResults: {
      marginTop: spacing.margin.large,
    },
  });
};

export default InvitePeopleToYourGroup;

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';

import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroupMembers } from '~/interfaces/IGroup';

import Text from '~/beinComponents/Text';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import MemberOptionsMenu from './components/MemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';
import MembersContent from './components/MembersContent';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';

const _GroupMembers = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const [selectedMember, setSelectedMember] = useState<IGroupMembers>();
  const [isOpen, setIsOpen] = useState(false);

  const [needReloadWhenReconnected, setNeedReloadWhenReconnected] = useState(false);
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const baseSheetRef: any = useRef();

  const { offset } = useKeySelector(groupsKeySelector.groupMembers);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canAddMember = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.ADD_REMOVE_GROUP_MEMBER,
  );

  const getGroupProfile = () => {
    dispatch(groupsActions.getGroupDetail({ groupId }));
  };

  const getMembers = () => {
    if (groupId) {
      dispatch(groupsActions.getGroupMembers({ groupId }));
    }
  };

  useEffect(
    () => {
      if (!isInternetReachable) {
        setNeedReloadWhenReconnected(true);
        return;
      }

      const isDataEmpty = offset === 0;
      if (needReloadWhenReconnected && isDataEmpty) {
        getMembers();
        getGroupProfile();
        setNeedReloadWhenReconnected(false);
      }
    }, [isInternetReachable],
  );

  const clearSelectedMember = () => setSelectedMember(undefined);

  const onPressMenu = (item: IGroupMembers) => {
    if (!item || !item.id) return;

    setSelectedMember(item);
    baseSheetRef.current?.open();
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  // only admin or moderator can see this button
  const renderInviteMemberButton = () => (
    canAddMember && (
      <ButtonWrapper
        testID="group_members.invite"
        style={styles.inviteButton}
        onPress={goInviteMembers}
      >
        <Icon
          style={styles.iconSmall}
          icon="UserPlus"
          size={22}
          tintColor={theme.colors.purple60}
        />
        <Text.ButtonM color={theme.colors.purple60} useI18n>
          common:text_invite
        </Text.ButtonM>
      </ButtonWrapper>
    )
  );
  const goInviteMembers = () => {
    dispatch(groupsActions.clearSelectedUsers());
    rootNavigation.navigate(
      groupStack.inviteMembers, { groupId },
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white}>
      <Header titleTextProps={{ useI18n: true }} title="groups:title_members_other" />
      <View style={styles.searchBar}>
        <Pressable
          testID="group_members.search"
          onPress={onPressSearch}
          style={styles.searchBtn}
        >
          <View pointerEvents="none">
            <SearchInput placeholder={i18next.t('groups:text_search_member')} />
          </View>
        </Pressable>
        {renderInviteMemberButton()}
      </View>

      <MembersContent groupId={groupId} onPressMenu={onPressMenu} />

      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember || {}}
        onOptionsClosed={clearSelectedMember}
      />

      <SearchMemberView
        groupId={groupId}
        isOpen={isOpen}
        onClose={onCloseModal}
        onPressMenu={onPressMenu}
        placeholder={i18next.t('groups:text_search_member')}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    searchBtn: {
      flex: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.base,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputSearch: {
      flex: 1,
    },
    inviteButton: {
      backgroundColor: colors.white,
      padding: spacing.padding.small,
      borderRadius: 6,
      marginRight: spacing.margin.small,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
    },
  });
};

const GroupMembers = React.memo(_GroupMembers);
GroupMembers.whyDidYouRender = true;
export default GroupMembers;

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';

import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { useRootNavigation } from '~/hooks/navigation';
import { IGroupMembers } from '~/interfaces/IGroup';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header, { HeaderProps } from '~/beinComponents/Header';
import MemberOptionsMenu from './components/MemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import GroupMemberList from './GroupMemberList';
import Tab from '~/baseComponents/Tab';
import { MEMBER_TABS } from '~/screens/communities/CommunityMembers';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import GroupMemberRequests from './GroupMemberRequests';
import { IconType } from '~/resources/icons';

const _GroupMembers = ({ route }: any) => {
  const { groupId, targetIndex, isMember } = route.params;

  const [selectedMember, setSelectedMember] = useState<IGroupMembers>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);
  const { ids } = useKeySelector(groupsKeySelector.groupMemberRequests);

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
  const canApproveRejectJoiningRequests = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.APPROVE_REJECT_GROUP_JOINING_REQUESTS,
  );
  const canEditJoinSetting = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.EDIT_GROUP_JOIN_SETTING,
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

  const onPressAdd = () => {
    rootNavigation.navigate(groupStack.addMembers, { groupId });
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <GroupMemberList groupId={groupId} onPressMenu={onPressMenu} />;
    }

    if (selectedIndex === 1) {
      return (
        <GroupMemberRequests
          groupId={groupId}
          canAddMember={canAddMember}
          canApproveRejectJoiningRequests={canApproveRejectJoiningRequests}
          canEditJoinSetting={canEditJoinSetting}
          onPressAdd={onPressAdd}
        />
      );
    }

    return null;
  };

  const showAddButton = () => {
    if (canAddMember) {
      // don't show button Add on header when there's button Add Members on Member request screen
      if (selectedIndex === 1 && ids.length === 0) return false;
      return true;
    }

    return false;
  };

  const headerProps: HeaderProps = showAddButton() && {
    buttonText: 'common:text_add',
    onPressButton: onPressAdd,
    buttonProps: { icon: 'Plus', style: styles.addButton, useI18n: true },
  };

  const showSearchMember = isMember && {
    icon: 'search' as IconType,
    onPressIcon: onPressSearch,
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.gray5}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="groups:title_members_other"
        {...showSearchMember}
        {...headerProps}
      />

      {(!!canApproveRejectJoiningRequests || !!canEditJoinSetting) && (
        <View style={styles.tabContainer}>
          <Tab
            buttonProps={{ size: 'large', type: 'primary', useI18n: true }}
            data={MEMBER_TABS}
            onPressTab={onPressTab}
            activeIndex={selectedIndex}
          />
        </View>
      )}

      <View style={styles.memberList}>
        {renderContent()}
      </View>

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
    tabContainer: {
      backgroundColor: colors.white,
      marginTop: spacing.margin.large,
    },
    memberList: {
      flex: 1,
      marginTop: spacing.margin.large,
      backgroundColor: colors.gray5,
    },
    addButton: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.small,
    },
  });
};

const GroupMembers = React.memo(_GroupMembers);
GroupMembers.whyDidYouRender = true;
export default GroupMembers;

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';

import { cloneDeep } from 'lodash';
import { useRootNavigation } from '~/hooks/navigation';
import { IGroupMembers } from '~/interfaces/IGroup';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import MemberOptionsMenu from './components/GroupMemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';
import spacing from '~/theme/spacing';
import GroupMemberList from './GroupMemberList';
import Tab from '~/baseComponents/Tab';
import { MEMBER_TABS } from '~/screens/communities/CommunityMembers';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import GroupMemberRequests from './GroupMemberRequests';
import { IconType } from '~/resources/icons';
import useGroupMemberStore, { IGroupMemberState } from './store';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import useGroupDetailStore from '../GroupDetail/store';
import { onPressButtonInvite } from '~/components/InvitePeopleToYourGroup/helper';

const _GroupMembers = ({ route }: any) => {
  const { groupId, targetIndex, isMemberCommunity } = route.params;

  const [selectedMember, setSelectedMember] = useState<IGroupMembers>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);

  const [needReloadWhenReconnected, setNeedReloadWhenReconnected] = useState(false);
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const baseSheetRef: any = useRef();
  const { actions, groupMembers: { offset } } = useGroupMemberStore((state: IGroupMemberState) => state);
  const { getGroupDetail } = useGroupDetailStore((state) => state.actions);

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canAddMember = shouldHavePermission(
    groupId,
    PermissionKey.ADD_MEMBER,
  );
  const canApproveRejectJoiningRequests = shouldHavePermission(
    groupId,
    PermissionKey.APPROVE_REJECT_JOINING_REQUESTS,
  );
  const canEditJoinSetting = shouldHavePermission(
    groupId,
    PermissionKey.EDIT_JOIN_SETTING,
  );

  const getGroupProfile = () => {
    getGroupDetail({ groupId });
  };

  const getMembers = () => {
    if (!groupId) return;
    actions.getGroupMembers({ groupId, isRefreshing: true });
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
          onPressAdd={onPressAdd}
        />
      );
    }

    return null;
  };

  const isShowInvitedPeopleTabs = canAddMember;
  const isShowMemberRequestsTab = canApproveRejectJoiningRequests || canEditJoinSetting;

  const showSearchMember = isMemberCommunity && {
    icon: 'search' as IconType,
    onPressIcon: onPressSearch,
  };

  const showButtonInvite = isShowInvitedPeopleTabs && {
    buttonText: 'common:text_invite',
    buttonProps: { useI18n: true, icon: 'Plus' as IconType, iconSize: 14 },
    onPressButton: () => onPressButtonInvite(groupId),
  };

  const renderTabs = () => {
    const memberTabsClone = cloneDeep(MEMBER_TABS);
    if (!isShowMemberRequestsTab && !isShowInvitedPeopleTabs) return null;

    if (isShowMemberRequestsTab && !isShowInvitedPeopleTabs) {
      memberTabsClone.splice(1, 1);
    } else if (!isShowMemberRequestsTab && isShowInvitedPeopleTabs) {
      memberTabsClone.splice(2, 1);
    }

    return (
      <View style={styles.tabContainer}>
        <Tab
          buttonProps={{ size: 'large', type: 'primary', useI18n: true }}
          data={memberTabsClone}
          onPressTab={onPressTab}
          activeIndex={selectedIndex}
          isScrollToIndex
        />
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.gray5}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="groups:title_members_other"
        {...showSearchMember}
        {...showButtonInvite}
      />

      {renderTabs()}

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

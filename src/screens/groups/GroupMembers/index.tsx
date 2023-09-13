import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';

import { IGroupMembers } from '~/interfaces/IGroup';

import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import MemberOptionsMenu from './components/GroupMemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';
import spacing from '~/theme/spacing';
import GroupMemberRequests from './GroupMemberRequests';
import { IconType } from '~/resources/icons';
import useGroupMemberStore, { IGroupMemberState } from './store';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import useGroupDetailStore from '../GroupDetail/store';
import { onPressButtonInvite } from '~/components/InvitePeopleToYourGroup/helper';
import { renderTabs } from '~/screens/communities/CommunityMembers/helper';
import CommunityInvitedPeople from '~/screens/communities/CommunityMembers/CommunityInvitedPeople';
import { ITypeGroup } from '~/interfaces/common';

const _GroupMembers = ({ route }: any) => {
  const {
    groupId, targetIndex, isMemberCommunity, communityId,
  } = route.params;

  const [selectedMember, setSelectedMember] = useState<IGroupMembers>();
  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);

  const [needReloadWhenReconnected, setNeedReloadWhenReconnected] = useState(false);
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const baseSheetRef: any = useRef();
  const {
    actions,
    groupMembers: { offset },
  } = useGroupMemberStore((state: IGroupMemberState) => state);
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

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <SearchMemberView
            isMemberCommunity={isMemberCommunity}
            placeholder={t('groups:text_search_for_members')}
            onPressMenu={onPressMenu}
            groupId={groupId}
            communityId={communityId}
          />
        );
      case 1:
        return (
          <GroupMemberRequests groupId={groupId} canApproveRejectJoiningRequests={canApproveRejectJoiningRequests} />
        );
      case 2:
        return <CommunityInvitedPeople type={ITypeGroup.GROUP} groupId={groupId} />;
      default:
        return null;
    }
  };

  const isShowInvitedPeopleTab = canAddMember;
  const isShowMemberRequestsTab = canApproveRejectJoiningRequests || canEditJoinSetting;

  const showButtonInvite = isShowInvitedPeopleTab && {
    buttonText: 'common:text_invite',
    buttonProps: { useI18n: true, icon: 'Plus' as IconType, iconSize: 14 },
    onPressButton: () => onPressButtonInvite({ groupId, type: ITypeGroup.GROUP }),
  };

  const _renderTabs = () => renderTabs({
    isShowInvitedPeopleTab,
    isShowMemberRequestsTab,
    selectedIndex,
    onPressTab,
  });

  return (
    <ScreenWrapper isFullView backgroundColor={colors.gray5}>
      <Header titleTextProps={{ useI18n: true }} title="groups:title_members_other" {...showButtonInvite} />

      {_renderTabs()}

      <View style={styles.memberList}>
        {renderContent()}
      </View>

      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember || {}}
        onOptionsClosed={clearSelectedMember}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
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

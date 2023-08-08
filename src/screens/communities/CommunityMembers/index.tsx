import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { StyleSheet, View } from 'react-native';
import { cloneDeep } from 'lodash';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import SearchMemberView from './CommunityMemberList/components/SearchMemberView';
import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import CommunityMemberList from './CommunityMemberList';
import Tab from '~/baseComponents/Tab';
import { MEMBER_TAB_TYPES } from '../constants';
import { spacing } from '~/theme';
import CommunityMemberRequests from './CommunityMemberRequests';
import { IconType } from '~/resources/icons';
import MemberOptionsMenu from './components/CommunityMemberOptionsMenu';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import { onPressButtonInvite } from '~/components/InvitePeopleToYourGroup/helper';

export const MEMBER_TABS = [
  { id: MEMBER_TAB_TYPES.MEMBER_LIST, text: 'communities:member_tab_types:title_member_list' },
  { id: MEMBER_TAB_TYPES.MEMBER_REQUESTS, text: 'communities:member_tab_types:title_member_requests' },
  { id: MEMBER_TAB_TYPES.INVITED_PEOPLE, text: 'communities:member_tab_types:title_invited_people' },
];

const CommunityMembers = ({ route }: any) => {
  const { communityId, targetIndex, isMember } = route.params;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();

  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ICommunityMembers>();
  const baseSheetRef: any = useRef();

  const community = useCommunitiesStore(useCallback(
    (state) => state.data[communityId] || {} as ICommunity, [communityId],
  ));
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  const { groupId } = community || {};
  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canApproveRejectJoiningRequests = shouldHavePermission(
    groupId,
    PermissionKey.APPROVE_REJECT_JOINING_REQUESTS,
  );
  const canEditJoinSetting = shouldHavePermission(
    groupId,
    PermissionKey.EDIT_JOIN_SETTING,
  );
  const canAddMember = shouldHavePermission(
    groupId,
    PermissionKey.ADD_MEMBER,
  );

  useEffect(() => {
    // In case there's no data available yet when navigating directly
    // from somewhere else such as notifications
    if (!community.id) {
      actions.getCommunity(communityId);
    }
  }, [communityId]);

  const clearSelectedMember = () => setSelectedMember(undefined);

  const onPressMenu = (item: ICommunityMembers) => {
    if (!item || !item.id) return;

    setSelectedMember(item);
    baseSheetRef.current?.open();
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <CommunityMemberList community={community} onPressMenu={onPressMenu} />;
    }

    if (selectedIndex === 1) {
      return (
        <CommunityMemberRequests
          community={community}
          canAddMember={false}
          canApproveRejectJoiningRequests={canApproveRejectJoiningRequests}
        />
      );
    }

    return null;
  };

  const isShowInvitedPeopleTabs = canAddMember;
  const isShowMemberRequestsTab = canApproveRejectJoiningRequests || canEditJoinSetting;

  const showSearchMember = isMember && {
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
        community={community}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember || {} as ICommunityMembers}
        onOptionsClosed={clearSelectedMember}
      />

      <SearchMemberView
        isOpen={isOpen}
        community={community}
        onClose={onCloseModal}
        onPressMenu={onPressMenu}
        placeholder={t('groups:text_search_member')}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ExtendedTheme) => {
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

export default CommunityMembers;

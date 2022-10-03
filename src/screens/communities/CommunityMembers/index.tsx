import React, { useState, useRef } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header, { HeaderProps } from '~/beinComponents/Header';

import SearchMemberView from './CommunityMemberList/components/SearchMemberView';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import CommunityMemberList from './CommunityMemberList';
import Tab from '~/baseComponents/Tab';
import { MEMBER_TAB_TYPES } from '../constants';
import { spacing } from '~/theme';
import { useMyPermissions } from '~/hooks/permissions';
import CommunityMemberRequests from './CommunityMemberRequests';
import modalActions from '~/storeRedux/modal/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { IconType } from '~/resources/icons';
import MemberOptionsMenu from './components/MemberOptionsMenu';

export const MEMBER_TABS = [
  { id: MEMBER_TAB_TYPES.MEMBER_LIST, text: 'communities:member_tab_types:title_member_list' },
  { id: MEMBER_TAB_TYPES.MEMBER_REQUESTS, text: 'communities:member_tab_types:title_member_requests' },
];

const CommunityMembers = ({ route }: any) => {
  const { communityId, targetIndex, isMember } = route.params;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);
  const [isOpen, setIsOpen] = useState(false);
  const { ids } = useKeySelector(groupsKeySelector.communityMemberRequests);
  const [selectedMember, setSelectedMember] = useState<ICommunityMembers>();
  const baseSheetRef: any = useRef();

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canApproveRejectJoiningRequests = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.APPROVE_REJECT_COMMUNITY_JOINING_REQUESTS,
  );
  const canEditJoinSetting = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_JOIN_SETTING,
  );
  const canAddMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
  );

  const clearSelectedMember = () => setSelectedMember(undefined);

  const onPressMenu = (item: ICommunityMembers) => {
    if (!item || !item.id) return;

    setSelectedMember(item);
    baseSheetRef.current?.open();
  };

  const onPressAdd = () => {
    dispatch(modalActions.showAlertNewFeature());
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
      return <CommunityMemberList communityId={communityId} onPressMenu={onPressMenu} />;
    }

    if (selectedIndex === 1) {
      return (
        <CommunityMemberRequests
          communityId={communityId}
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
        communityId={communityId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember || {} as ICommunityMembers}
        onOptionsClosed={clearSelectedMember}
      />

      <SearchMemberView
        isOpen={isOpen}
        communityId={communityId}
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

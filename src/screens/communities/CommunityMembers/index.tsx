import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { StyleSheet, View } from 'react-native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import SearchMemberView from './CommunityMemberList/components/SearchMemberView';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import CommunityMemberList from './CommunityMemberList';
import Tab from '~/baseComponents/Tab';
import { MEMBER_TAB_TYPES } from '../constants';
import { spacing } from '~/theme';
import { useMyPermissions } from '~/hooks/permissions';
import CommunityMemberRequests from './CommunityMemberRequests';

const MEMBER_TABS = [
  { id: MEMBER_TAB_TYPES.MEMBER_LIST, text: 'communities:member_tab_types:title_member_list' },
  { id: MEMBER_TAB_TYPES.MEMBER_REQUESTS, text: 'communities:member_tab_types:title_member_requests' },
];

const CommunityMembers = ({ route }: any) => {
  const { communityId } = route.params;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageJoiningRequests = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.APPROVE_REJECT_COMMUNITY_JOINING_REQUESTS,
      PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_JOIN_SETTING,
    ],
  );

  const onPressMenu = (item: ICommunityMembers) => {
    // TODO: ADD PRESS MENU
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

  const renderContent = () => (selectedIndex === 0
    ? <CommunityMemberList communityId={communityId} onPressMenu={onPressMenu} />
    : selectedIndex === 1
      ? <CommunityMemberRequests communityId={communityId} />
      : null
  );

  return (
    <ScreenWrapper isFullView backgroundColor={colors.gray5}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="groups:title_members_other"
        icon="search"
        onPressIcon={onPressSearch}
      />

      {!!canManageJoiningRequests && (
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
  });
};

export default CommunityMembers;

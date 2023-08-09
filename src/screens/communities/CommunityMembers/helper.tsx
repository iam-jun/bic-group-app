import { cloneDeep } from 'lodash';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { MEMBER_TABS } from './index';
import Tab from '~/baseComponents/Tab';
import { spacing } from '~/theme';

export const renderTabs = (params: {
  isShowMemberRequestsTab: boolean;
  isShowInvitedPeopleTab: boolean;
  selectedIndex: number;
  onPressTab: (item: any, index: number) => void;
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    isShowMemberRequestsTab, isShowInvitedPeopleTab, selectedIndex, onPressTab,
  } = params;

  const memberTabsClone = cloneDeep(MEMBER_TABS);
  if (!isShowMemberRequestsTab && !isShowInvitedPeopleTab) return null;

  if (isShowMemberRequestsTab && !isShowInvitedPeopleTab) {
    memberTabsClone.splice(1, 1);
  } else if (!isShowMemberRequestsTab && isShowInvitedPeopleTab) {
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    tabContainer: {
      backgroundColor: colors.white,
      marginTop: spacing.margin.large,
    },
  });
};

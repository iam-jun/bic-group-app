import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import Text from '~/baseComponents/Text';
import MemberItem from './MemberItem';
import appConfig from '~/configs/appConfig';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { formatLargeNumber } from '~/utils/formatter';
import useMemberSection from '~/hooks/useMemberSection';
import useBlockingStore from '~/store/blocking';

interface MemberListProps {
  type: 'group' | 'community';
  isAdminRole: boolean;
  canManageMember: boolean;
  communityId: string;
  onLoadMore: () => void;
  onPressMenu: (item: any) => void;
  onRefresh: () => void;
}

const MemberList = ({
  type,
  isAdminRole,
  canManageMember,
  communityId,
  onLoadMore,
  onPressMenu,
  onRefresh,
}: MemberListProps) => {
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const memberSectionData = useMemberSection(type);

  const {
    loading, refreshing, sectionList,
  } = memberSectionData;

  const {
    loading: loadingBlocking,
  } = useBlockingStore();

  const renderEmpty = () => {
    if (loading || loadingBlocking) return null;
    return <NoSearchResultsFound />;
  };

  const renderSectionHeader = ({ section: { title, userCount } }: any) => (
    <View style={styles.sectionHeader}>
      <Text.H4 color={colors.neutral40}>
        {`${title} · ${formatLargeNumber(userCount)}`}
      </Text.H4>
    </View>
  );

  const renderListFooter = () => {
    if (!loading && !loadingBlocking) return <ViewSpacing height={insets.bottom || spacing.padding.large} />;

    return (
      <View
        testID="member_list.loading_more_indicator"
        style={styles.listFooter}
      >
        <ActivityIndicator />
      </View>
    );
  };

  const renderItem = ({ item }: {item: any}) => (
    <MemberItem
      item={item}
      communityId={communityId}
      isAdminRole={isAdminRole}
      canManageMember={canManageMember}
      onPressMenu={onPressMenu}
    />
  );

  const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.small} />;

  const keyExtractor = (item, index) => `member_list_${item.id}_${index}`;

  // The purpose of waiting for 2 api (getListMembers && getListRelationship) to finish running at the same time
  const sections = loadingBlocking ? [] : sectionList;

  return (
    <SectionList
      testID="member_list"
      style={styles.content}
      sections={sections}
      keyExtractor={keyExtractor}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      ListEmptyComponent={renderEmpty}
      initialNumToRender={appConfig.recordsPerPage}
      ListFooterComponent={renderListFooter}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparatorComponent}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gray40}
        />
      )}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    content: {
      backgroundColor: colors.white,
    },
    sectionHeader: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.base,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default React.memo(MemberList);

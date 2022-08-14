import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import NoSearchResult from '~/components/NoSearchResult';
import Text from '~/beinComponents/Text';
import MemberItem from './MemberItem';
import { getMembersSection } from '../../../storeRedux/groups/selectors';
import appConfig from '~/configs/appConfig';
import spacing from '~/theme/spacing';

interface MemberListProps {
  type: 'group' | 'community';
  canManageMember: boolean;
  onLoadMore: () => void;
  onPressMenu: (item: any) => void;
  onRefresh?: () => void;
}

const MemberList = ({
  type,
  canManageMember,
  onLoadMore,
  onPressMenu,
  onRefresh,
}: MemberListProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const memberSectionData = getMembersSection(type);
  const { loading, canLoadMore, sectionList } = memberSectionData;

  const renderEmpty = () => (!loading ? <NoSearchResult /> : null);

  const renderSectionHeader = ({ section: { title, userCount } }: any) => (
    <View style={styles.sectionHeader}>
      <Text.BodyM
        color={colors.neutral80}
      >
        {`${title} • ${userCount}`}
      </Text.BodyM>
    </View>
  );

  const renderListFooter = () => {
    if (
      canLoadMore
      && (sectionList[0]?.data?.length || 0) + (sectionList[1]?.data?.length || 0) > 0
    ) {
      return (
        <View
          testID="member_list.loading_more_indicator"
          style={styles.listFooter}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }: {item: any}) => (
    <MemberItem
      item={item}
      canManageMember={canManageMember}
      onPressMenu={onPressMenu}
    />
  );

  return (
    <SectionList
      testID="member_list"
      style={styles.content}
      sections={sectionList}
      keyExtractor={(
        item, index,
      ) => `member_list_${item.id}_${index}`}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={renderEmpty}
      initialNumToRender={appConfig.recordsPerPage}
      ListFooterComponent={renderListFooter}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{}} />}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.gray40}
          />
        ) : undefined
      }
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    content: {
      backgroundColor: colors.white,
    },
    itemContainer: {
      height: undefined,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
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

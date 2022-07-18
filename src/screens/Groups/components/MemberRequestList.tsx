import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import {useBaseHook} from '~/hooks';
import Divider from '~/beinComponents/Divider';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import GroupMemberRequest from '../GroupDetail/groupModerating/components/GroupMemberRequest';
import CommunityMemberRequest from '../CommunityAdmin/PendingMembers/CommunityMemberRequest';
import spacing from '~/theme/spacing';

interface MemberRequestListProps {
  type: 'community' | 'group';
  onLoadMore: () => void;
  onRefresh: () => void;
  id: number;
}

const MemberRequestList = ({
  type,
  onLoadMore,
  onRefresh,
  id,
}: MemberRequestListProps) => {
  const theme: ExtendedTheme = useTheme();
  const {t} = useBaseHook();

  const {loading, total, ids, canLoadMore} = useKeySelector(
    groupsKeySelector[`${type}MemberRequests`],
  );

  const renderItem = ({item}: {item: number}) => {
    const ItemComponent =
      type === 'community' ? CommunityMemberRequest : GroupMemberRequest;

    return <ItemComponent requestId={item} organizationId={id} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={'addUsers'}
        title="groups:text_no_pending_members_notice"
        description={`groups:text_pending_request_notice_${type}`}
      />
    );
  };

  const renderListHeader = () => {
    if (!total) return null;
    return (
      <View style={styles.requestHeader}>
        <Text.H5 testID="member_request_list.request_title">{`${total} ${t(
          'common:text_request',
          {
            count: total,
          },
        )}`}</Text.H5>
      </View>
    );
  };

  const renderListFooter = () => {
    return (
      !loading &&
      canLoadMore &&
      ids.length > 0 && (
        <View
          style={styles.listFooter}
          testID="member_request_list.loading_more_indicator">
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <FlatList
      testID="flatlist"
      style={styles.flatList}
      data={ids}
      renderItem={renderItem}
      keyExtractor={(item, index) => `requests_${item}_${index}`}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderListHeader}
      ListFooterComponent={renderListFooter}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginHorizontal: spacing.margin.large,
  },
  requestHeader: {
    marginVertical: spacing.margin.base,
  },
  divider: {
    marginBottom: spacing.margin.small,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MemberRequestList;

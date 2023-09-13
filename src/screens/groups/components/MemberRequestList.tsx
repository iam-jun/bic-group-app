import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import EmptyScreen from '~/components/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import GroupPendingUserItemWrapper from '~/screens/groups/GroupMembers/GroupMemberRequests/components/GroupPendingUserItemWrapper';
import CommunityPendingUserItemWrapper from '~/screens/communities/CommunityMembers/CommunityMemberRequests/components/CommunityPendingUserItemWrapper';
import spacing from '~/theme/spacing';
import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useGroupMemberStore from '../GroupMembers/store';

interface MemberRequestListProps {
  id?: string;
  type: 'community' | 'group';
  onLoadMore: () => void;
  onRefresh: () => void;
}

const MemberRequestList = ({
  id,
  type,
  onLoadMore,
  onRefresh,
}: MemberRequestListProps) => {
  const theme: ExtendedTheme = useTheme();

  let loading: boolean;
  let ids: string[];
  let canLoadMore: boolean;
  const groupMemberRequests = useGroupMemberStore((state) => state.groupMemberRequests);
  const communityMemberRequests = useCommunityMemberStore((state) => state.communityMemberRequests);
  if (type === 'group') {
    loading = groupMemberRequests.loading;
    ids = groupMemberRequests.ids;
    canLoadMore = groupMemberRequests.canLoadMore;
  } else {
    loading = communityMemberRequests.loading;
    ids = communityMemberRequests.ids;
    canLoadMore = communityMemberRequests.canLoadMore;
  }

  const renderItem = ({ item: requestId }: {item: string}) => {
    if (id && type === 'community') return <CommunityPendingUserItemWrapper requestId={requestId} organizationId={id} />;

    return <GroupPendingUserItemWrapper requestId={requestId} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        size={120}
        icon="addUsers"
        title="groups:text_no_pending_members_notice"
      />
    );
  };

  const renderListFooter = () => (
    !loading
      && canLoadMore
      && ids.length > 0 && (
      <View
        style={styles.listFooter}
        testID="member_request_list.loading_more_indicator"
      >
        <ActivityIndicator />
      </View>
    )
  );

  const renderItemSeparatorComponent = () => <Divider size={spacing.padding.large} />;

  return (
    <FlatList
      testID="member_request_list"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `requests_${item}_${index}`}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderListFooter}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={renderItemSeparatorComponent}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAddMembers: {
    marginVertical: spacing.margin.large,
  },
});

export default MemberRequestList;

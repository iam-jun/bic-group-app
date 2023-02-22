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
import { Button } from '~/baseComponents';
import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useGroupMemberStore from '../GroupMembers/store';

interface MemberRequestListProps {
  id?: string;
  type: 'community' | 'group';
  canAddMember?: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onPressAdd: () => void;
}

const MemberRequestList = ({
  id,
  type,
  canAddMember,
  onPressAdd,
  onLoadMore,
  onRefresh,
}: MemberRequestListProps) => {
  const theme: ExtendedTheme = useTheme();

  const {
    loading, ids, canLoadMore,
  } = type === 'group'
    ? useGroupMemberStore((state) => state.groupMemberRequests)
    : useCommunityMemberStore((state) => state.communityMemberRequests);

  const onPressAddMemmbers = () => {
    onPressAdd?.();
  };

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
        description={canAddMember ? `groups:text_pending_request_notice_${type}` : ''}
        ButtonComponent={canAddMember && (
          <Button.Primary
            style={styles.buttonAddMembers}
            size="large"
            type="solid"
            icon="Plus"
            onPress={onPressAddMemmbers}
            useI18n
          >
            groups:title_add_members
          </Button.Primary>
        )}
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

  return (
    <FlatList
      testID="flatlist"
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
      ItemSeparatorComponent={() => <Divider size={spacing.padding.large} />}
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

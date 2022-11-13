import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import { isEmpty } from 'lodash';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import spacing from '~/theme/spacing';
import GroupTabHeader from './GroupTabHeader';
import InfoHeader from '../../components/InfoHeader';
import GroupJoinCancelButton from './GroupJoinCancelButton';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useMounted from '~/hooks/mounted';
import { ICommunity } from '~/interfaces/ICommunity';
import ContentItem from '~/components/ContentItem';

interface GroupContentProps {
  community: ICommunity;
  onScroll: (e: any) => void;
  onGetInfoLayout: (e: any) => void;
}

const GroupContent = ({
  community,
  onScroll,
  onGetInfoLayout,
}: GroupContentProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = themeStyles();
  const isMounted = useMounted();

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const { id: groupId, teamName } = groupData;
  const communityId = community?.id;
  const communityName = community?.name;
  const isMemberCommunity = community?.joinStatus === GroupJoinStatus.MEMBER;

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const groupPost = useTimelineStore((state: ITimelineState) => state.items[groupId]);
  const { ids: posts, loading, refreshing: isRefreshingPost } = groupPost || {};
  const isLoadingPosts = (!isMounted || loading) && !isRefreshingPost;

  const isLoadingMore = !isEmpty(posts) && loading;

  const loadMoreData = () => {
    if (groupPost.hasNextPage) {
      timelineActions.getPosts(groupId);
    }
  };

  const renderItem = ({ item }: any) => (
    <ContentItem
      id={item}
      hasReactPermission={isMember}
      testID="group_content.post.item"
    />
  );

  const _onRefresh = () => {
    timelineActions.getPosts(groupId, true);
  };

  const renderHeader = () => (
    <View onLayout={onGetInfoLayout}>
      <InfoHeader
        infoDetail={groupData}
        insideCommunityName={communityName}
      />
      <GroupTabHeader
        groupId={groupId}
        isMemberCommunity={isMemberCommunity}
        isMember={isMember}
        communityId={communityId}
        teamName={teamName}
      />
      <GroupJoinCancelButton />
      {isLoadingPosts && renderLoading()}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loading}>
      <LoadingIndicator />
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) return renderLoading();

    return <ViewSpacing height={spacing.margin.base} />;
  };

  const renderItemSeparator = () => <ViewSpacing height={spacing.margin.base} />;

  return (
    <Animated.FlatList
      testID="flatlist"
      style={styles.listContainer}
      data={isMounted ? posts : []}
      renderItem={renderItem}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={renderItemSeparator}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator
      keyExtractor={(item: any, index: number) => `list-item-${item.id}-${index}`}
      refreshControl={(
        <RefreshControl
          refreshing={isRefreshingPost}
          tintColor={colors.gray40}
          onRefresh={_onRefresh}
        />
      )}
    />
  );
};

const themeStyles = () => StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listHeaderComponentStyle: {
    marginBottom: spacing.margin.base,
  },
  createPost: {
    marginTop: spacing.margin.small,
  },
  loading: {
    padding: spacing.padding.small,
  },
});

export default GroupContent;

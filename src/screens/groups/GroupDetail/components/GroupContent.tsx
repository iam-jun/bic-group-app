import React, { useCallback } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import { isEmpty } from 'lodash';
import ViewSpacing from '~/beinComponents/ViewSpacing';
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
import FilterFeedButtonGroup from '~/beinComponents/FilterFeedButtonGroup';
import Divider from '~/beinComponents/Divider';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';

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

  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: groupData, joinStatus } = groups[currentGroupId] || {};
  const { id: groupId, teamName } = groupData || {};

  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const communityId = community?.id;
  const communityName = community?.name;
  const isMemberCommunity = community?.joinStatus === GroupJoinStatus.MEMBER;

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const { timelines } = useTimelineStore();
  const { contentFilter, attributeFilter } = timelines?.[groupId] || {};
  const groupPost = useTimelineStore(
    useCallback((state: ITimelineState) => state.timelines?.[groupId]?.data?.[contentFilter]?.[attributeFilter], [
      groupId,
      contentFilter,
      attributeFilter,
    ]),
  );
  const { ids: posts, loading, refreshing: isRefreshingPost } = groupPost || {};
  const isLoadingPosts = (!isMounted || loading) && !isRefreshingPost;

  const isLoadingMore = !isEmpty(posts) && loading;

  const loadMoreData = () => {
    if (groupPost.hasNextPage) {
      timelineActions.getPosts(groupId);
    }
  };

  const _onPressContentFilterTab = (item: any) => {
    timelineActions.setContentFilter(groupId, item.id);
  };

  const _onPressAttributeFilterTab = (item: any) => {
    timelineActions.setAttributeFilter(groupId, item.id);
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
      <Divider color={colors.gray5} size={spacing.padding.large} />
      <FilterFeedButtonGroup
        contentFilter={contentFilter}
        attributeFilter={attributeFilter}
        onPressContentFilterTab={_onPressContentFilterTab}
        onPressAttributeFilterTab={_onPressAttributeFilterTab}
      />
      <Divider color={colors.neutral5} size={spacing.padding.tiny} />
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

  const renderItemSeparator = () => <ViewSpacing height={spacing.margin.large} />;

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

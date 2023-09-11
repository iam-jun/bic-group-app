import { View, StyleSheet, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { isEmpty } from 'lodash';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import spacing from '~/theme/spacing';
import PrivateWelcome from '../PrivateWelcome';
import { ICommunity } from '~/interfaces/ICommunity';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Divider from '~/beinComponents/Divider';
import InfoHeader from '~/screens/groups/components/InfoHeader';
import CommunityTabHeader from '../CommunityTabHeader';
import CommunityJoinCancelButton from '../CommunityJoinCancelButton';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import ContentItem from '~/components/ContentItem';
import FilterFeedButtonGroup from '~/beinComponents/FilterFeedButtonGroup';
import { ContentFeed, AttributeFeed } from '~/interfaces/IFeed';
import PostViewPlaceholder from '~/components/placeholder/PostViewPlaceholder';
import { BoxListPinContent } from '~/components/PinContent/components';
import InvitationView from '../InvitationView';
import { ITypeGroup } from '~/interfaces/common';

interface CommunityContentViewProps {
  community: ICommunity;
  isFetchingData: boolean;
  isMember: boolean;
  isPrivateCommunity: boolean;

  onRefresh: (isGetPost: boolean) => void;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const selector = (
  groupId: string,
  contentFilter: ContentFeed,
  attributeFilter: AttributeFeed,
) => (state: ITimelineState) => state.timelines?.[groupId]?.data?.[contentFilter]?.[attributeFilter];

const _CommunityContentView = ({
  community,
  isFetchingData,
  isMember,
  isPrivateCommunity,

  onRefresh,
  onScroll,
  onButtonLayout,
}: CommunityContentViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors, elevations } = theme;
  const styles = createStyles();
  // const isMounted = useMounted();
  const isMounted = true;

  const {
    id, teamName, groupId, invitation,
  } = community;

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const { timelines } = useTimelineStore();
  const { contentFilter, attributeFilter } = timelines?.[groupId] || {};
  const communityPost = useTimelineStore(
    useCallback(selector(groupId, contentFilter, attributeFilter), [
      groupId,
      contentFilter,
      attributeFilter,
    ]),
  );
  const { ids: posts, loading, refreshing: isRefreshingPost } = communityPost || {};

  const isLoadingPosts = (!isMounted || (isEmpty(posts) && loading)) && !isRefreshingPost;
  const isLoadingMore = isMounted && !isEmpty(posts) && loading;

  const loadMoreData = () => {
    if (communityPost.hasNextPage) { timelineActions.getPosts(groupId); }
  };

  const renderItem = ({ item }: any) => (
    <ContentItem id={item} hasReactPermission={isMember} testID="page_content.post.item" />
  );

  const onContentRefresh = () => onRefresh(true);
  const onPrivateRefresh = () => onRefresh(false);

  const renderPlaceHolderLoading = () => (
    <PostViewPlaceholder />
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

  if (isPrivateCommunity) {
    return (
      <PrivateWelcome
        isFetching={isFetchingData}
        community={community}
        onRefresh={onPrivateRefresh}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />
    );
  }

  const _onPressContentFilterTab = (item: any) => {
    timelineActions.setContentFilter(groupId, item.id);
  };

  const _onPressAttributeFilterTab = (item: any) => {
    timelineActions.setAttributeFilter(groupId, item.id);
  };

  return (
    <Animated.FlatList
      testID="flatlist"
      style={styles.listContainer}
      data={isMounted ? posts : []}
      renderItem={renderItem}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListHeaderComponent={(
        <View onLayout={onButtonLayout} style={elevations.e2}>
          <InfoHeader infoDetail={community} />
          <CommunityTabHeader communityId={id} groupId={groupId} isMember={isMember} teamName={teamName} />
          <InvitationView data={invitation} type={ITypeGroup.COMMUNITY} communityId={id} groupId="" />
          <CommunityJoinCancelButton community={community} isMember={isMember} />
          <BoxListPinContent id={groupId} />
          <FilterFeedButtonGroup
            contentFilter={contentFilter}
            attributeFilter={attributeFilter}
            onPressContentFilterTab={_onPressContentFilterTab}
            onPressAttributeFilterTab={_onPressAttributeFilterTab}
          />
          <Divider color={colors.gray5} size={spacing.padding.tiny} />
          {isLoadingPosts && renderPlaceHolderLoading()}
        </View>
      )}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={renderItemSeparator}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      refreshControl={(
        <RefreshControl
          refreshing={isRefreshingPost}
          tintColor={colors.gray40}
          onRefresh={onContentRefresh}
        />
      )}
      showsVerticalScrollIndicator
      keyExtractor={(item: any, index: number) => `list-item-${item.id}-${index}`}
    />
  );
};

const createStyles = () => StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listHeaderComponentStyle: {
    marginBottom: spacing.margin.base,
  },
  createPost: {
    marginTop: spacing.margin.base,
  },
  loading: {
    padding: spacing.padding.small,
  },
});

const CommunityContentView = React.memo(_CommunityContentView);
CommunityContentView.whyDidYouRender = true;
export default CommunityContentView;

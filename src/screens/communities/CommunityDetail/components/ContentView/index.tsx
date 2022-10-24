import { View, StyleSheet, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { isEmpty } from 'lodash';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import CommunityJoinCancelButton from '../CommunityJoinCancelButton';
import PostItem from '~/beinComponents/list/items/PostItem';
import spacing from '~/theme/spacing';
import CommunityTabHeader from '../CommunityTabHeader';
import InfoHeader from '../../../../groups/components/InfoHeader';
import PrivateWelcome from '../PrivateWelcome';
import { ICommunity } from '~/interfaces/ICommunity';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useMounted from '~/hooks/mounted';

interface ContentViewProps {
  community: ICommunity;
  isFetchingData: boolean;
  isMember: boolean;
  isPrivateCommunity: boolean;

  onRefresh: (isGetPost: boolean) => void;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const _ContentView = ({
  community,
  isFetchingData,
  isMember,
  isPrivateCommunity,

  onRefresh,
  onScroll,
  onButtonLayout,
}: ContentViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const isMounted = useMounted();

  const {
    id, teamName, groupId,
  } = community;

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const communityPost = useTimelineStore((state: ITimelineState) => state.items[groupId]);
  const { ids: posts, loading, refreshing: isRefreshingPost } = communityPost || {};

  const isLoadingPosts = (!isMounted || (isEmpty(posts) && loading)) && !isRefreshingPost;
  const isLoadingMore = isMounted && !isEmpty(posts) && loading;

  const loadMoreData = () => {
    if (communityPost.hasNextPage) { timelineActions.getPosts(groupId); }
  };

  const renderItem = ({ item }: any) => <PostItem postId={item} hasReactPermission={isMember} testID="page_content.post.item" />;

  const onContentRefresh = () => onRefresh(true);
  const onPrivateRefresh = () => onRefresh(false);

  const renderHeader = useCallback(() => (
    <View onLayout={onButtonLayout}>
      <InfoHeader infoDetail={community} />
      <CommunityTabHeader communityId={id} isMember={isMember} teamName={teamName} />
      <CommunityJoinCancelButton community={community} isMember={isMember} />
      {isLoadingPosts && renderLoading()}
    </View>
  ), [id, teamName, isLoadingPosts, community, isMember, onButtonLayout]);

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

const ContentView = React.memo(_ContentView);
ContentView.whyDidYouRender = true;
export default ContentView;

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

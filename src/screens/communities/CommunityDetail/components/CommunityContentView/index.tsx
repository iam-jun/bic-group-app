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
import InfoHeader from '~/screens/groups/components/InfoHeader';
import CommunityTabHeader from '../CommunityTabHeader';
import CommunityJoinCancelButton from '../CommunityJoinCancelButton';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import ContentItem from '~/components/ContentItem';

interface CommunityContentViewProps {
  community: ICommunity;
  isFetchingData: boolean;
  isMember: boolean;
  isPrivateCommunity: boolean;

  onRefresh: (isGetPost: boolean) => void;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const selector = (groupId: string) => (state: ITimelineState) => state.items[groupId];

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
  const { colors } = theme;
  const styles = createStyles();
  // const isMounted = useMounted();
  const isMounted = true;

  const {
    id, teamName, groupId,
  } = community;

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const communityPost = useTimelineStore(useCallback(selector(groupId), [groupId]));
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
        <View onLayout={onButtonLayout}>
          <InfoHeader infoDetail={community} />
          <CommunityTabHeader communityId={id} isMember={isMember} teamName={teamName} />
          <CommunityJoinCancelButton community={community} isMember={isMember} />
          {isLoadingPosts && renderLoading()}
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

import { View, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';

import InfoHeader from './InfoHeader';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import JoinCancelButton from './JoinCancelButton';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import PostItem from '~/beinComponents/list/items/PostItem';
import actions from '~/screens/Groups/redux/actions';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import TabButtonHeader from './TabButtonHeader';

interface PageContentProps {
  communityId: string;
  getPosts: () => void;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const _PageContent = ({
  communityId,
  getPosts,
  onScroll,
  onButtonLayout,
}: PageContentProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = createStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { joinStatus, groupId } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;
  const posts = useKeySelector(groupsKeySelector.posts);
  const refreshingGroupPosts = useKeySelector(groupsKeySelector.refreshingGroupPosts);

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canCreatePostArticle = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.CREATE_POST_ARTICLE,
  );

  const dispatch = useDispatch();

  const onPressYourGroups = () => {
    rootNavigation.navigate(
      groupStack.yourGroups, { communityId },
    );
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(actions.mergeExtraGroupPosts(groupId));
    }
  };

  const renderItem = ({ item }: any) => <PostItem postData={item} testID="page_content.post.item" />;

  const _onRefresh = () => {
    dispatch(actions.getCommunityDetail({ communityId }));
    getPosts();
  };

  const renderHeader = () => (
    <>
      <View onLayout={onButtonLayout}>
        <InfoHeader onPressGroupTree={onPressYourGroups} />
        <TabButtonHeader communityId={communityId} isMember={isMember} />
        <JoinCancelButton />
      </View>
      {isMember && canCreatePostArticle && (
      <HeaderCreatePost
        style={styles.createPost}
        audience={{ ...infoDetail, id: groupId }}
        createFromGroupId={groupId}
      />
      )}
    </>
  );

  return (
    <Animated.FlatList
      testID="flatlist"
      style={styles.listContainer}
      data={posts.data}
      renderItem={renderItem}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={spacing.padding.base} />}
      ItemSeparatorComponent={() => <ViewSpacing height={spacing.margin.base} />}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      refreshControl={(
        <RefreshControl
          refreshing={refreshingGroupPosts}
          onRefresh={_onRefresh}
          tintColor={colors.gray40}
        />
      )}
      showsVerticalScrollIndicator
      keyExtractor={(item) => `list-item-${item}`}
    />
  );
};

const PageContent = React.memo(_PageContent);
PageContent.whyDidYouRender = true;
export default PageContent;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    createPost: {
      marginTop: spacing.margin.base,
    },
  });
};

import {
  View, ScrollView, StyleSheet, DeviceEventEmitter,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
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

  const onPressDiscover = () => {
    rootNavigation.navigate(
      groupStack.discoverGroups, { communityId },
    );
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.communityAbout);
  };

  const onPressMembers = () => {
    rootNavigation.navigate(
      groupStack.communityMembers, { communityId },
    );
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(actions.mergeExtraGroupPosts(groupId));
    }
  };

  const _onScroll = (e: any) => {
    onScroll && onScroll(e);
    DeviceEventEmitter.emit('stopAllVideo');
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
    <ListView
      isFullView
      style={styles.listContainer}
      data={posts.data}
      renderItem={renderItem}
      onScroll={_onScroll}
      scrollEventThrottle={16}
      refreshing={refreshingGroupPosts}
      onRefresh={_onRefresh}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={spacing.padding.base} />}
      renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
    />
  );
};

const PageContent = React.memo(_PageContent);
PageContent.whyDidYouRender = true;
export default PageContent;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.white,
    },
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    scrollViewBtn: {
      paddingBottom: spacing.padding.tiny,
      backgroundColor: colors.white,
    },
    createPost: {
      marginTop: spacing.margin.base,
    },
  });
};

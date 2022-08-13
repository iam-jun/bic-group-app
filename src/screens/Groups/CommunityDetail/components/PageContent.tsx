import { View, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import CommunityJoinCancelButton from './CommunityJoinCancelButton';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import PostItem from '~/beinComponents/list/items/PostItem';
import actions from '~/storeRedux/groups/actions';
import spacing from '~/theme/spacing';
import CommunityTabHeader from './CommunityTabHeader';
import InfoHeader from '../../components/InfoHeader';
import CommunityJoinedGroupTree from '~/screens/Groups/components/CommunityJoinedGroupTree';
import modalActions from '~/storeRedux/modal/actions';

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
  const {
    name, teamName, joinStatus, groupId,
  } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;
  const posts = useKeySelector(groupsKeySelector.posts);
  const refreshingGroupPosts = useKeySelector(groupsKeySelector.refreshingGroupPosts);

  const dispatch = useDispatch();

  const onPressYourGroups = () => {
    // rootNavigation.navigate(
    //   groupStack.yourGroups, { communityId },
    // );
    dispatch(modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: name,
      ContentComponent: (<CommunityJoinedGroupTree communityId={communityId} teamName={teamName} />),
    }));
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
    <View onLayout={onButtonLayout}>
      <InfoHeader infoDetail={infoDetail} isMember={isMember} onPressGroupTree={onPressYourGroups} />
      <CommunityTabHeader communityId={communityId} isMember={isMember} />
      <CommunityJoinCancelButton />
    </View>
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
      keyExtractor={(item: any, index: number) => `list-item-${item.id}-${index}`}
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

import { View, StyleSheet, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';

import ViewSpacing from '~/beinComponents/ViewSpacing';
import CommunityJoinCancelButton from '../CommunityJoinCancelButton';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import PostItem from '~/beinComponents/list/items/PostItem';
import actions from '~/storeRedux/groups/actions';
import spacing from '~/theme/spacing';
import CommunityTabHeader from '../CommunityTabHeader';
import InfoHeader from '../../../../groups/components/InfoHeader';
import CommunityJoinedGroupTree from '~/screens/groups/components/CommunityJoinedGroupTree';
import modalActions from '~/storeRedux/modal/actions';
import PrivateWelcome from '../PrivateWelcome';
import { ICommunity } from '~/interfaces/ICommunity';

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

  const {
    id, name, teamName, groupId,
  } = community;

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
      ContentComponent: (<CommunityJoinedGroupTree communityId={id} teamName={teamName} />),
    }));
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(actions.mergeExtraGroupPosts(groupId));
    }
  };

  const renderItem = ({ item }: any) => <PostItem postData={item} hasReactPermission={isMember} testID="page_content.post.item" />;

  const onContentRefresh = () => onRefresh(true);
  const onPrivateRefresh = () => onRefresh(false);

  const renderHeader = useCallback(() => (
    <View onLayout={onButtonLayout}>
      <InfoHeader infoDetail={community} isMember={isMember} onPressGroupTree={onPressYourGroups} />
      <CommunityTabHeader communityId={id} isMember={isMember} />
      <CommunityJoinCancelButton community={community} isMember={isMember} />
    </View>
  ), [id, community, isMember, onButtonLayout, onPressYourGroups]);

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
          onRefresh={onContentRefresh}
          tintColor={colors.gray40}
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
});

import React from 'react';
import {
  RefreshControl, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Animated from 'react-native-reanimated';
import PostItem from '~/beinComponents/list/items/PostItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import spacing from '~/theme/spacing';
import GroupTabHeader from './GroupTabHeader';
import InfoHeader from '../../components/InfoHeader';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import GroupJoinCancelButton from './GroupJoinCancelButton';

interface GroupContentProps {
  getGroupPosts: () => void;
  onScroll: (e: any) => void;
  onGetInfoLayout: (e: any) => void;
}

const GroupContent = ({
  getGroupPosts,
  onScroll,
  onGetInfoLayout,
}: GroupContentProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const posts = useKeySelector(groupsKeySelector.posts);
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;
  const { id: groupId } = groupData;
  const refreshingGroupPosts = useKeySelector(groupsKeySelector.refreshingGroupPosts);
  const { id: communityId, name: communityName } = useKeySelector(groupsKeySelector.communityDetail)

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(groupsActions.mergeExtraGroupPosts(groupId));
    }
  };

  const onPressYourGroups = () => {
    rootNavigation.navigate(
      groupStack.yourGroups, { communityId },
    );
  };

  const renderItem = ({ item }: any) => <PostItem postData={item} testID="group_content.post.item" />;

  const _onRefresh = () => {
    getGroupPosts();
  };

  const renderHeader = () => (
    <View onLayout={onGetInfoLayout}>
      <InfoHeader
        infoDetail={groupData}
        isMember={isMember}
        insideCommunityName={communityName}
        onPressGroupTree={onPressYourGroups}
      />
      <GroupTabHeader groupId={groupId} isMember={isMember} />
      <GroupJoinCancelButton />
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
      showsVerticalScrollIndicator
      keyExtractor={(item: any, index: number) => `list-item-${item.id}-${index}`}
      refreshControl={(
        <RefreshControl
          refreshing={refreshingGroupPosts}
          onRefresh={_onRefresh}
          tintColor={colors.gray40}
        />
      )}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    createPost: {
      marginTop: spacing.margin.small,
    },
  });
};

export default GroupContent;

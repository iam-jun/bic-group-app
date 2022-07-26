import React from 'react';
import {
  DeviceEventEmitter, ScrollView, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Button from '~/beinComponents/Button';
import PostItem from '~/beinComponents/list/items/PostItem';
import ListView from '~/beinComponents/list/ListView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacy } from '~/constants/privacyTypes';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import GroupInfoHeader from '~/screens/Groups/GroupDetail/components/GroupInfoHeader';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import { showAlertNewFeature } from '~/store/modal/actions';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';

const GroupContent = ({
  getGroupPosts,
}: {
  getGroupPosts: () => void;
}) => {
  const theme: ExtendedTheme = useTheme();
  const { rootNavigation } = useRootNavigation();
  const { colors } = theme || {};
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const posts = useKeySelector(groupsKeySelector.posts);
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;
  const { id: groupId } = groupData;
  const isPublicGroup = groupData.privacy === groupPrivacy.public;
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canCreatePostArticle = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.CREATE_POST_ARTICLE,
  );

  const onPressChat = () => {
    dispatch(showAlertNewFeature());
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.groupAbout, { groupId });
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId });
  };

  const onPressFiles = () => {
    rootNavigation.navigate(groupStack.groupFiles, { groupId });
  };

  const onPressChannel = () => {
    rootNavigation.navigate(groupStack.groupFiles, { groupId });
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(groupsActions.mergeExtraGroupPosts(groupId));
    }
  };

  const onScroll = () => {
    DeviceEventEmitter.emit('stopAllVideo');
  };

  const renderItem = ({ item }: any) => <PostItem postData={item} testID="group_content.post.item" />;

  const _onRefresh = () => {
    getGroupPosts();
  };

  const renderHeader = () => (
    <>
      <View style={styles.groupInfo}>
        <GroupInfoHeader />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={false}
          style={{ backgroundColor: colors.white }}
          contentContainerStyle={styles.buttonContainer}
        >
          {isMember && (
          <>
            <Button.Secondary
              useI18n
              onPress={onPressChat}
              color={colors.neutral5}
              textColor={colors.neutral80}
              borderRadius={spacing.borderRadius.small}
              testID="group_content.post"
            >
              groups:group_content:btn_post
            </Button.Secondary>
            <ViewSpacing width={spacing.margin.base} />
          </>
          )}
          <Button.Secondary
            useI18n
            onPress={onPressChannel}
            color={colors.neutral5}
            textColor={colors.neutral80}
            borderRadius={spacing.borderRadius.small}
            testID="group_content.channel"
          >
            groups:group_content:btn_channel
          </Button.Secondary>
          <ViewSpacing width={spacing.margin.base} />
          <Button.Secondary
            useI18n
            onPress={onPressAbout}
            color={colors.neutral5}
            textColor={colors.neutral80}
            borderRadius={spacing.borderRadius.small}
            testID="group_content.about"
          >
            groups:group_content:btn_about
          </Button.Secondary>
          <ViewSpacing width={spacing.margin.base} />
          {(isMember || isPublicGroup) && (
          <Button.Secondary
            useI18n
            onPress={onPressMembers}
            color={colors.neutral5}
            textColor={colors.neutral80}
            borderRadius={spacing.borderRadius.small}
            testID="group_content.members"
          >
            groups:group_content:btn_members
          </Button.Secondary>
          )}
          <ViewSpacing width={spacing.margin.base} />
          <Button.Secondary
            useI18n
            onPress={onPressFiles}
            color={colors.neutral5}
            textColor={colors.neutral80}
            borderRadius={spacing.borderRadius.small}
            testID="group_content.files"
          >
            groups:group_content:btn_files
          </Button.Secondary>
        </ScrollView>
      </View>
      {isMember && canCreatePostArticle && (
      <HeaderCreatePost
        audience={groupData}
        style={styles.createPost}
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
      refreshing={refreshingGroupPosts}
      onScroll={onScroll}
      onRefresh={_onRefresh}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={spacing.padding.base} />}
      renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    groupInfo: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.white,
    },
    createPost: {
      marginTop: spacing.margin.small,
    },
  });
};

export default GroupContent;

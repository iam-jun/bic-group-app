import React from 'react';
import {Platform, StyleSheet, View, Text, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import PostItem from '~/beinComponents/list/items/PostItem';

import ListView from '~/beinComponents/list/ListView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import GroupInfoHeader from '~/screens/Groups/GroupDetail/components/GroupInfoHeader';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {groupPrivacy} from '~/constants/privacyTypes';
import {showAlertNewFeature} from '~/store/modal/actions';

const GroupContent = ({
  getGroupPosts,
  parentWidth,
}: {
  getGroupPosts: () => void;
  parentWidth?: number;
}) => {
  const theme = useTheme() as ITheme;
  const {rootNavigation} = useRootNavigation();
  const {spacing, colors} = theme || {};
  const styles = themeStyles(theme, parentWidth);
  const dispatch = useDispatch();

  const posts = useKeySelector(groupsKeySelector.posts);
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;
  const {id: groupId} = groupData;
  const isPublicGroup = groupData.privacy === groupPrivacy.public;
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );

  const onPressChat = () => {
    dispatch(showAlertNewFeature());
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.groupAbout, {groupId});
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const onPressFiles = () => {
    rootNavigation.navigate(groupStack.groupFiles);
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(groupsActions.mergeExtraGroupPosts(groupId));
    }
  };

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const _onRefresh = () => {
    getGroupPosts();
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.groupInfo}>
          <GroupInfoHeader />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            style={{backgroundColor: colors.background}}
            contentContainerStyle={styles.buttonContainer}>
            {isMember && (
              <>
                <Button.Secondary
                  useI18n
                  onPress={onPressChat}
                  color={colors.bgHover}
                  textColor={colors.textPrimary}
                  borderRadius={spacing.borderRadius.small}
                  testID="group_content.post">
                  groups:group_content:btn_post
                </Button.Secondary>
                <ViewSpacing width={spacing.margin.base} />
              </>
            )}
            <Button.Secondary
              useI18n
              onPress={onPressAbout}
              color={colors.bgHover}
              textColor={colors.textPrimary}
              borderRadius={spacing.borderRadius.small}
              testID="group_content.about">
              groups:group_content:btn_about
            </Button.Secondary>
            <ViewSpacing width={spacing.margin.base} />
            {(isMember || isPublicGroup) && (
              <Button.Secondary
                useI18n
                onPress={onPressMembers}
                color={colors.bgHover}
                textColor={colors.textPrimary}
                borderRadius={spacing.borderRadius.small}
                testID="group_content.members">
                groups:group_content:btn_members
              </Button.Secondary>
            )}
            <ViewSpacing width={spacing.margin.base} />
            <Button.Secondary
              useI18n
              onPress={onPressFiles}
              color={colors.bgHover}
              textColor={colors.textPrimary}
              borderRadius={spacing.borderRadius.small}
              testID="group_content.files">
              groups:group_content:btn_files
            </Button.Secondary>
          </ScrollView>
        </View>
        {isMember && (
          <HeaderCreatePost
            audience={groupData}
            parentWidth={parentWidth}
            style={styles.createPost}
            createFromGroupId={groupId}
          />
        )}
      </>
    );
  };

  return (
    <ListView
      isFullView
      style={styles.listContainer}
      data={posts.data}
      refreshing={refreshingGroupPosts}
      onRefresh={_onRefresh}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={theme.spacing.padding.base} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing.margin.base} />
      )}
    />
  );
};

const themeStyles = (theme: ITheme, parentWidth = deviceDimensions.phone) => {
  const {spacing, dimension, colors} = theme;
  const bigParentOnWeb =
    Platform.OS === 'web' && parentWidth > dimension.maxNewsfeedWidth;

  return StyleSheet.create({
    groupInfo: {
      flex: 1,
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
          borderRadius: bigParentOnWeb ? 6 : 0,
          overflow: 'hidden',
        },
      }),
    },
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginTop: bigParentOnWeb ? spacing.margin.small : 0,
      marginBottom: spacing.margin.base,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.background,
    },
    createPost: {
      marginTop: spacing.margin.small,
    },
  });
};

export default GroupContent;

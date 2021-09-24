import {StreamClient} from 'getstream';
import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
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
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import GroupInfoHeader from '~/screens/Groups/GroupDetail/components/GroupInfoHeader';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';

const GroupContent = ({
  getGroupPosts,
  streamClient,
}: {
  getGroupPosts: () => void;
  streamClient: StreamClient;
}) => {
  const theme = useTheme() as ITheme;
  const {rootNavigation} = useRootNavigation();
  const {spacing} = theme || {};
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const posts = useKeySelector(groupsKeySelector.posts);
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const {rocket_chat_id, id: groupId} = groupData;
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );
  const userId = useUserIdAuth();
  const dimensions = useWindowDimensions();
  const onPressChat = () => {
    const isLaptop = dimensions.width >= deviceDimensions.laptop;
    const isLaptopWeb = Platform.OS === 'web' && isLaptop;
    if (isLaptopWeb) {
      rootNavigation.navigate(chatStack.conversation, {
        roomId: rocket_chat_id,
      });
      return;
    }
    rootNavigation.navigate('chat', {
      screen: chatStack.conversation,
      params: {roomId: rocket_chat_id, initial: false},
    });
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
      dispatch(
        groupsActions.mergeExtraGroupPosts({streamClient, userId, groupId}),
      );
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
      <View>
        <GroupInfoHeader />
        <View style={styles.buttonContainer}>
          {join_status === groupJoinStatus.member && (
            <>
              <Button.Secondary useI18n onPress={onPressChat}>
                chat:title
              </Button.Secondary>
              <ViewSpacing width={spacing.margin.base} />
            </>
          )}
          <Button.Secondary useI18n onPress={onPressAbout}>
            settings:title_about
          </Button.Secondary>
          <ViewSpacing width={spacing.margin.base} />
          <Button.Secondary useI18n onPress={onPressMembers}>
            chat:title_members
          </Button.Secondary>
          <ViewSpacing width={spacing.margin.base} />
          <Button.Secondary useI18n onPress={onPressFiles}>
            common:text_files
          </Button.Secondary>
        </View>
        <ViewSpacing height={spacing.margin.small} />
        <HeaderCreatePost audience={groupData} />
      </View>
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

const themeStyles = (theme: ITheme) => {
  const {spacing, dimension, colors} = theme;

  return StyleSheet.create({
    listContainer: {
      flex: 1,
      ...Platform.select({
        web: {
          alignSelf: 'center',
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
        },
      }),
    },
    listHeaderComponentStyle: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.base,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.background,
    },
  });
};

export default GroupContent;

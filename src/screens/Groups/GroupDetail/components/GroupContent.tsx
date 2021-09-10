import React from 'react';
import {View, Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ListView from '~/beinComponents/list/ListView';
import PostItem from '~/beinComponents/list/items/PostItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import GroupInfoHeader from '~/screens/Groups/GroupDetail/components/GroupInfoHeader';
import Button from '~/beinComponents/Button';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import groupJoinStatus from '~/constants/groupJoinStatus';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

const GroupContent = ({getGroupPosts}: {getGroupPosts: () => void}) => {
  const theme = useTheme() as ITheme;
  const {rootNavigation} = useRootNavigation();
  const {spacing} = theme || {};
  const styles = themeStyles(theme);

  const groupPosts = useKeySelector(groupsKeySelector.groupPosts) || [];
  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const {rocket_chat_id} = groupData;
  const groupId = groupData.id;
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );

  const onPressChat = () => {
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
      data={groupPosts}
      refreshing={refreshingGroupPosts}
      onRefresh={_onRefresh}
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

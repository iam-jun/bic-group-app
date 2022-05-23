import {View, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import Button from '~/beinComponents/Button';
import InfoHeader from './InfoHeader';
import {ITheme} from '~/theme/interfaces';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import JoinCancelButton from './JoinCancelButton';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import PostItem from '~/beinComponents/list/items/PostItem';
import actions from '~/screens/Groups/redux/actions';

interface PageContentProps {
  communityId: number;
  getPosts: () => void;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const PageContent = ({
  communityId,
  getPosts,
  onScroll,
  onButtonLayout,
}: PageContentProps) => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme || {};
  const styles = createStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {join_status, group_id} = infoDetail;
  const isMember = join_status === groupJoinStatus.member;
  const posts = useKeySelector(groupsKeySelector.posts);
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );
  const dispatch = useDispatch();

  const onPressDiscover = () => {
    rootNavigation.navigate(groupStack.discoverGroups, {communityId});
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.communityAbout);
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.communityMembers, {communityId});
  };

  const loadMoreData = () => {
    if (posts.extra.length !== 0) {
      dispatch(actions.mergeExtraGroupPosts(group_id));
    }
  };

  const onPressYourGroups = () => {
    rootNavigation.navigate(groupStack.yourGroups, {communityId});
  };

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} testID="page_content.post.item" />;
  };

  const _onRefresh = () => {
    getPosts();
  };

  const renderHeader = () => {
    return (
      <>
        <View onLayout={onButtonLayout}>
          <InfoHeader />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            style={styles.scrollViewBtn}
            contentContainerStyle={styles.buttonContainer}>
            {isMember && (
              <>
                <Button.Secondary
                  useI18n
                  color={colors.bgHover}
                  textColor={colors.textPrimary}
                  borderRadius={spacing.borderRadius.small}
                  testID="page_content.your_groups_btn"
                  onPress={onPressYourGroups}>
                  groups:group_content:btn_your_groups
                </Button.Secondary>
                <ViewSpacing width={spacing.margin.small} />
                <Button.Secondary
                  useI18n
                  color={colors.bgHover}
                  textColor={colors.textPrimary}
                  borderRadius={spacing.borderRadius.small}
                  testID="page_content.discover_btn"
                  onPress={onPressDiscover}>
                  groups:group_content:btn_discover
                </Button.Secondary>
                <ViewSpacing width={spacing.margin.small} />
              </>
            )}
            <Button.Secondary
              useI18n
              color={colors.bgHover}
              textColor={colors.textPrimary}
              borderRadius={spacing.borderRadius.small}
              testID="page_content.about_btn"
              onPress={onPressAbout}>
              groups:group_content:btn_about
            </Button.Secondary>
            <ViewSpacing width={spacing.margin.small} />
            <Button.Secondary
              useI18n
              color={colors.bgHover}
              textColor={colors.textPrimary}
              borderRadius={spacing.borderRadius.small}
              testID="page_content.members_btn"
              onPress={onPressMembers}>
              groups:group_content:btn_members
            </Button.Secondary>
          </ScrollView>
          <JoinCancelButton />
        </View>
        {isMember && (
          <HeaderCreatePost
            style={styles.createPost}
            audience={{...infoDetail, id: group_id}}
            createFromGroupId={group_id}
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
      renderItem={renderItem}
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshing={refreshingGroupPosts}
      onRefresh={_onRefresh}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={theme.spacing.padding.base} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing.margin.base} />
      )}
    />
  );
};

export default PageContent;

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    scrollViewBtn: {
      paddingBottom: spacing.padding.tiny,
      backgroundColor: colors.background,
    },
    createPost: {
      marginTop: spacing.margin.base,
    },
  });
};

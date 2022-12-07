import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, memo, useMemo,
} from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { isEqual } from 'lodash';
import Image from '~/beinComponents/Image';
import ReactionView from '~/beinComponents/ReactionView';
import Text from '~/baseComponents/Text';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import {
  IPost,
} from '~/interfaces/IPost';
import resourceImages from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import {
  ButtonMarkAsRead, PostBody, PostFooter, PostHeader, PostImportant,
} from '../index';
import spacing from '~/theme/spacing';
import { ContentInterestedUserCount } from '~/components/ContentView';
import appConfig from '~/configs/appConfig';
import useContentActions from '~/hooks/useContentActions';
import { isEmptyPost } from '~/helpers/post';

export interface PostViewProps {
  style?: any;
  testID?: string;
  data: IPost;
  isLite?: boolean;
  isPostDetail?: boolean;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  hasReactPermission?: boolean;
  pressNavigateToDetail?: boolean;

  onPress?: () => void;
  onPressHeader?: () => void;
  onContentLayout?: () => void;
  onPressComment?: (postId: string) => void;
}

const _PostView: FC<PostViewProps> = ({
  style,
  data = {},
  isLite,
  testID = 'post_view',
  isPostDetail = false,
  btnReactTestID,
  btnCommentTestID,
  hasReactPermission = true,
  pressNavigateToDetail,

  onPress,
  onPressHeader,
  onPressComment,
  onContentLayout,
}: PostViewProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    id: postId, actor, content, highlight, setting, deleted, markedReadPost,
    ownerReactions, reactionsCount, totalUsersSeen, communities,
  } = data;

  const {
    isImportant, importantExpiredAt, canReact,
  } = setting || {};

  const isEmpty = useMemo(() => isEmptyPost(data), [data]);

  const userId = useUserIdAuth();

  const {
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
    onPressMarkSeenPost,
  } = useContentActions({ postId, ownerReactions, reactionsCount });

  const _onPress = () => {
    if (pressNavigateToDetail) {
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });
    } else {
      onPress?.();
    }
  };

  if (deleted) {
    return (
      <View style={[styles.deletedContainer, style]}>
        <Image style={styles.imageDelete} source={resourceImages.img_delete} />
        <Text.H6 testID="post_view.label_deleted" useI18n>
          post:label_post_deleted
        </Text.H6>
      </View>
    );
  }

  const shouldShowInterested = highlight?.length < appConfig.shortPostContentLength
  || content?.length < appConfig.shortPostContentLength || isPostDetail;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      disabled={(!onPress && !pressNavigateToDetail) || !hasReactPermission}
      onPress={_onPress}
      style={style}
    >
      <PostImportant
        isLite={isLite}
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={markedReadPost}
        listCommunity={communities}
      />
      <View style={[styles.container]} onLayout={onContentLayout}>
        <PostHeader
          useDefaultMenu
          data={data}
          disabled={!hasReactPermission}
          onPressHeader={onPressHeader}
        />
        <PostBody
          data={data}
          isLite={isLite}
          isEmptyPost={isEmpty}
          isPostDetail={isPostDetail}
          onPressMarkSeenPost={onPressMarkSeenPost}
        />
        {!isLite && shouldShowInterested && (
          <ContentInterestedUserCount id={postId} interestedUserCount={totalUsersSeen} />
        )}
        {!isLite && !!canReact && (
          <ReactionView
            style={styles.reactions}
            ownerReactions={ownerReactions}
            reactionsCount={reactionsCount}
            hasReactPermission={hasReactPermission}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onLongPressReaction={onLongPressReaction}
          />
        )}
        <PostFooter
          postId={postId}
          isLite={isLite}
          btnReactTestID={btnReactTestID}
          btnCommentTestID={btnCommentTestID}
          hasReactPermission={hasReactPermission}
          onPressComment={onPressComment}
          onAddReaction={onAddReaction}
        />
        {!isLite && (
          <ButtonMarkAsRead
            postId={postId}
            markedReadPost={markedReadPost}
            isImportant={isImportant}
            expireTime={importantExpiredAt}
            isActor={actor?.id == userId}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    rowCenter: { flexDirection: 'row', alignItems: 'center' },
    container: {
      backgroundColor: colors.white,
      ...elevations.e2,
    },
    reactions: {
      paddingHorizontal: spacing.padding.base,
    },
    deletedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    imageDelete: { width: 35, height: 35, marginRight: spacing.margin.large },
    seenCountsViewAtBottom: {
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
  });
};

function propsAreEqual(
  prev: any, next: any,
) {
  return isEqual(
    prev, next,
  );
}

const PostView = memo(_PostView, propsAreEqual);
PostView.whyDidYouRender = true;
export default PostView;

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, memo, useMemo,
} from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { isEqual } from 'lodash';
import ReactionView from '~/beinComponents/ReactionView';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import {
  IPost, TargetType,
} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import {
  ButtonMarkAsRead, PostBody, PostFooter, PostHeader, PostImportant,
} from '../index';
import spacing from '~/theme/spacing';
import { ContentInterestedUserCount } from '~/components/ContentView';
import appConfig from '~/configs/appConfig';
import useContentActions from '~/hooks/useContentActions';
import { isEmptyPost } from '~/helpers/post';
import { PlaceHolderRemoveContent } from '~/baseComponents';
import Divider from '~/beinComponents/Divider';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

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
    ownerReactions, reactionsCount, totalUsersSeen, communities, reported,
  } = data;

  const {
    isImportant, importantExpiredAt, canReact,
  } = setting || {};

  const isEmpty = useMemo(() => isEmptyPost(data), [data]);

  const userId = useUserIdAuth();

  const {
    onAddReaction, onRemoveReaction, onLongPressReaction, onPressMarkSeenPost,
  } = useContentActions({
    postId,
    ownerReactions,
    reactionsCount,
    targetType: TargetType.POST,
  });

  const isReported = usePostsStore(postsSelector.getIsReported(postId));

  const _onPress = () => {
    if (pressNavigateToDetail) {
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });
    } else {
      onPress?.();
    }
  };

  if (deleted) {
    return (<PlaceHolderRemoveContent label="post:label_post_deleted" />);
  }

  if (reported) {
    return (<PlaceHolderRemoveContent label="common:text_post_reported" />);
  }

  const shouldShowInterested = highlight?.length < appConfig.shortPostContentLength
  || content?.length < appConfig.shortPostContentLength || isPostDetail;

  const renderContent = () => {
    if (isReported) {
      return null;
    }
    return (
      <>
        {!isLite && <Divider style={styles.divider} />}
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
      </>
    );
  };

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
        {renderContent()}
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
    seenCountsViewAtBottom: {
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
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

import React, { FC, useCallback } from 'react';

import { Omit } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/ContentFooter';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { formatLargeNumber } from '~/utils/formatter';
import { useBaseHook } from '~/hooks';
import { ContentFooterLite, ContentFooterLiteProps } from '~/components/ContentView';
import { getTotalReactions } from '~/helpers/post';
import { PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { TrackingEventContentReadAction, TrackingEvent } from '~/services/tracking/constants';

export interface PostFooterProps extends Partial<ContentFooterProps>,
 Partial<Omit<Omit<ContentFooterLiteProps, 'reactionsCount'>, 'onPressComment'>> {
  postId: string;
  isLite?: boolean;
}

const PostFooter: FC<PostFooterProps> = ({
  postId,
  isLite,
  onPressComment,
  ...props
}) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const reactionsCount = usePostsStore(useCallback(postsSelector.getReactionCounts(postId), [postId]));
  const commentsCount = usePostsStore(useCallback(postsSelector.getCommentsCount(postId), [postId]));
  const setting = usePostsStore(useCallback(postsSelector.getSetting(postId), [postId]));
  const totalUsersSeen = usePostsStore(useCallback(postsSelector.getTotalUsersSeen(postId), [postId]));
  const {
    canComment, canReact,
  } = setting || {};

  const commentCount = formatLargeNumber(commentsCount);
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, {
        post_id: postId,
        focus_comment: true,
      });

      // tracking event
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.POST,
        action: TrackingEventContentReadAction.COMMENT,
      };
      trackEvent({ event: TrackingEvent.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  if (isLite) {
    return (
      <ContentFooterLite
        {...props}
        id={postId}
        reactionsCount={getTotalReactions(reactionsCount, 'user')}
        commentsCount={commentsCount}
        totalUsersSeen={totalUsersSeen}
      />
    );
  }

  return (
    <ContentFooter
      {...props}
      canReact={canReact}
      reactionsCount={reactionsCount}
      labelButtonComment={labelButtonComment}
      canComment={canComment}
      onPressComment={_onPressComment}
    />
  );
};

export default PostFooter;

import React, { FC } from 'react';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { IPost, PostType } from '~/interfaces/IPost';
import useArticleMenu from '~/hooks/useArticleMenu';
import { TrackingEventContentReadAction, TrackingEventContentReadProperties, TrackingEventType } from '~/interfaces/ITrackingEvent';
import { trackEvent } from '~/services/tracking';

export interface ArticleHeaderProps extends ContentHeaderProps {
  data: IPost;
}

const ArticleHeader: FC<ArticleHeaderProps> = ({
  data,
  actor,
  disabled = false,
  onPressHeader,
  ...props
}) => {
  const { rootNavigation } = useRootNavigation();
  const userId = useUserIdAuth();
  const isCreator = actor?.id == userId;
  const { id: articleId } = data;

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.();
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId });

      // tracking event
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.ARTICLE,
        action: TrackingEventContentReadAction.CONTENT_HEADER,
      };
      trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  const { showMenu } = useArticleMenu(data, isCreator);

  return (
    <ContentHeader
      {...props}
      postId={articleId}
      actor={actor}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={showMenu}
    />
  );
};

export default ArticleHeader;

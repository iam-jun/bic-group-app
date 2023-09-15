import React, { FC } from 'react';
import { Keyboard } from 'react-native';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { IPost, PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { TrackingEventContentReadAction, TrackingEvent } from '~/services/tracking/constants';
import useModalStore from '~/store/modal';
import MenuContent from '~/components/MenuContent';

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
  const { showModal } = useModalStore((state) => state.actions);
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
      trackEvent({ event: TrackingEvent.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  const onShowMenu = () => {
    Keyboard.dismiss();
    showModal({
      isOpen: true,
      ContentComponent: (
        <MenuContent
          data={data}
          isActor={isCreator}
          contentType={PostType.ARTICLE}
        />
      ),
    });
  };

  return (
    <ContentHeader
      {...props}
      postId={articleId}
      actor={actor}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={onShowMenu}
    />
  );
};

export default ArticleHeader;

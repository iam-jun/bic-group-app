import React, { FC } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button } from '~/baseComponents';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import usePostMenu from '~/hooks/usePostMenu';
import { IAudienceGroup, PostType } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import AlertDeleteAudiences from '../AlertDeleteAudiences';
import useModalStore from '~/store/modal';
import usePostsStore from '~/store/entities/posts';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { TrackingEventContentReadAction, TrackingEvent } from '~/services/tracking/constants';

export interface PostHeaderProps extends Partial<ContentHeaderProps> {
  data: any,
  useDefaultMenu?: boolean;
}

const PostHeader: FC<PostHeaderProps> = ({
  data,
  disabled = false,
  useDefaultMenu,
  onPressHeader,
  ...props
}) => {
  const route = useRoute();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const { showAlert } = useModalStore((state) => state.actions);
  const postActions = usePostsStore((state) => state.actions);

  const {
    id: postId, actor, audience, createdAt,
  } = data;

  const userId = useUserIdAuth();
  const isActor = actor?.id === userId;

  const isPostDetailScreen = route.name === homeStack.postDetail;

  const { shouldHavePermissionOnSomeAudience } = useMyPermissionsStore((state) => state.actions);
  const canDeleteOwnPost = shouldHavePermissionOnSomeAudience(
    audience?.groups,
    PermissionKey.CRUD_POST_ARTICLE,
  );

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.();
    } else {
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });

      // tracking event
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.POST,
        action: TrackingEventContentReadAction.CONTENT_HEADER,
      };
      trackEvent({ event: TrackingEvent.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  const handleDeletePostError = (listIdAudiences: string[]) => {
    if (listIdAudiences?.length <= 0 || audience?.groups?.length <= 0) {
      return;
    }

    const listAudiences = listIdAudiences.map((audienceId) => {
      const _audience = audience.groups.find(
        (audience: IAudienceGroup) => audience?.id === audienceId,
      );
      return _audience;
    });
    if (canDeleteOwnPost) {
      showAlert({
        title: t('post:title_delete_audiences_of_post'),
        children: (
          <AlertDeleteAudiences
            data={listAudiences}
            textContent={t('post:content_delete_audiences_of_post')}
          />
        ),
        cancelBtn: true,
        confirmLabel: t('common:text_remove'),
        ConfirmBtnComponent: Button.Danger,
        onConfirm: () => postActions.removeAudiencesFromPost({
          id: postId,
          listAudiences: listIdAudiences,
        }),
        confirmBtnProps: { type: 'ghost' },
      });
    } else {
      showAlert({
        title: t('post:title_delete_audiences_of_post'),
        children: (
          <AlertDeleteAudiences
            data={listAudiences}
            textContent={t('post:content_not_able_delete_of_post')}
          />
        ),
        cancelBtn: true,
        cancelLabel: t('common:btn_close'),
        onConfirm: null,
      });
    }
  };

  const { showMenu } = usePostMenu(data, isActor, isPostDetailScreen, handleDeletePostError);

  const onPressMenu = useDefaultMenu ? showMenu : undefined;

  return (
    <ContentHeader
      {...props}
      postId={postId}
      actor={actor}
      audience={audience}
      createdAt={createdAt}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={onPressMenu}
    />
  );
};

export default PostHeader;

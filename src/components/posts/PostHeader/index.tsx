import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import usePostMenu from '~/hooks/usePostMenu';
import { IAudienceGroup } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import postActions from '~/storeRedux/post/actions';
import AlertDeleteAudiences from '../AlertDeleteAudiences';
import useModalStore from '~/store/modal';

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
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { showAlert } = useModalStore((state) => state.actions);

  const {
    id: postId, actor, audience, createdAt,
  } = data;

  const userId = useUserIdAuth();
  const isActor = actor?.id === userId;

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
        onConfirm: () => dispatch(
          postActions.removePostAudiences({
            id: postId,
            listAudiences: listIdAudiences,
          }),
        ),
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

  const { showMenu } = usePostMenu(data, isActor, true, handleDeletePostError);

  const onPressMenu = useDefaultMenu ? showMenu : undefined;

  return (
    <ContentHeader
      {...props}
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

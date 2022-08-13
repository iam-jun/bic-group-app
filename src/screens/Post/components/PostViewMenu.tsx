import Clipboard from '@react-native-clipboard/clipboard';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import { IReaction, IAudienceGroup } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import postActions from '~/storeRedux/post/actions';
import * as modalActions from '~/storeRedux/modal/actions';
import { showHideToastMessage } from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import { getLink, LINK_POST } from '~/utils/link';
import postKeySelector from '../../../storeRedux/post/keySelector';
import AlertDeleteAudiencesConfirmContent from './AlertDeleteAudiencesConfirmContent';

export interface PostViewMenuProps {
  postId: string;
  isPostDetail: boolean;
  isActor: boolean;
  isDraftPost?: boolean;
  getDataPromise?:(params: any)=>void;
}

const PostViewMenu: FC<PostViewMenuProps> = ({
  postId,
  isPostDetail,
  isActor,
  isDraftPost,
  getDataPromise,
}: PostViewMenuProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const postData = useKeySelector(postKeySelector.postById(postId));
  const { audience, reactionsCount } = postData || {};
  const { hasPermissionsOnAtLeastOneScope, PERMISSION_KEY } = useMyPermissions();
  const canDeleteOwnPost = hasPermissionsOnAtLeastOneScope(
    'groups',
    audience?.groups,
    PERMISSION_KEY.GROUP.DELETE_OWN_POST,
  );

  const onPress = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideModal());
    dispatch(
      modalActions.showAlert({
        title: t('post:title_delete_post'),
        content: t('post:content_delete_post'),
        iconName: 'TrashCan',
        cancelBtn: true,
        confirmLabel: t('common:btn_delete'),
        onConfirm: () => dispatch(postActions.deletePost({
          id: postId,
          isDraftPost,
          callbackError: handleDeltePostError,
        })),
      }),
    );
  };

  const handleDeltePostError = (listIdAudiences: string[]) => {
    if (listIdAudiences?.length > 0 && audience?.groups?.length > 0) {
      const listAudiences = listIdAudiences.map((audienceId) => {
        const _audience = audience.groups.find((audience: IAudienceGroup) => audience?.id === audienceId)
        return _audience;
      })
      if (canDeleteOwnPost) {
        dispatch(
          modalActions.showAlert({
            title: t('post:title_delete_audiences_of_post'),
            children: <AlertDeleteAudiencesConfirmContent data={listAudiences} canDeleteOwnPost={canDeleteOwnPost} />,
            cancelBtn: true,
            confirmLabel: t('common:btn_delete'),
            onConfirm: () => dispatch(postActions.removePostAudiences({
              id: postId,
              listAudiences: listIdAudiences,
            })),
          }),
        );
      } else {
        dispatch(
          modalActions.showAlert({
            title: t('post:title_delete_audiences_of_post'),
            children: <AlertDeleteAudiencesConfirmContent data={listAudiences} canDeleteOwnPost={canDeleteOwnPost} />,
            cancelBtn: true,
            cancelLabel: t('common:btn_close'),
            onConfirm: null,
          }),
        );
      }
    }
  }

  const onPressEditSettings = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(
      homeStack.postSettings, { postId },
    );
  };

  const onPressEdit = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(
      homeStack.createPost, {
        postId,
        replaceWithDetail: !isPostDetail,
      },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
    Clipboard.setString(getLink(
      LINK_POST, postId,
    ));
    dispatch(showHideToastMessage({
      content: 'common:text_link_copied_to_clipboard',
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    }));
  };

  const onPressViewReactions = () => {
    dispatch(modalActions.hideModal());
    const firstReact = Object.values(reactionsCount)[0] as IReaction;
    if (!!firstReact && !isEmpty(firstReact)) {
      const initReaction = Object.keys(firstReact)[0];
      const payload: IPayloadReactionDetailBottomSheet = {
        isOpen: true,
        reactionCounts: reactionsCount,
        initReaction,
        getDataParam: { target: 'POST', targetId: postId },
        getDataPromise,
      };
      dispatch(modalActions.showReactionDetailBottomSheet(payload));
    }
  }

  return (
    <View style={styles.container}>
      {isActor && (
        <PrimaryItem
          testID="post_view_menu.edit"
          style={styles.item}
          leftIcon="edit"
          leftIconProps={{ icon: 'edit', size: 24 }}
          title={t('post:post_menu_edit')}
          onPress={onPressEdit}
        />
      )}
      {isActor && (
        <PrimaryItem
          testID="post_view_menu.edit_settings"
          style={styles.item}
          leftIcon="SlidersUp"
          leftIconProps={{ icon: 'SlidersUp', size: 24 }}
          title={t('post:post_menu_edit_settings')}
          onPress={onPressEditSettings}
        />
      )}
      <PrimaryItem
        testID="post_view_menu.copy"
        style={styles.item}
        leftIcon="Copy"
        leftIconProps={{ icon: 'Copy', size: 24 }}
        title={t('post:post_menu_copy')}
        onPress={onPressCopyLink}
      />
      <PrimaryItem
        testID="post_view_menu.bookmark"
        style={styles.item}
        leftIcon="Bookmark"
        leftIconProps={{ icon: 'Bookmark', size: 24 }}
        title={t('post:post_menu_save')}
        onPress={onPress}
      />
      {!!reactionsCount && !!Object.keys(reactionsCount)?.[0]
      && (
      <PrimaryItem
        testID="post_view_menu.insights"
        style={styles.item}
        leftIcon="iconReact"
        leftIconProps={{ icon: 'iconReact', size: 24 }}
        title={t('post:post_menu_view_reactions')}
        onPress={onPressViewReactions}
      />
      )}
      <PrimaryItem
        testID="post_view_menu.noti"
        style={styles.item}
        leftIcon="Bell"
        leftIconProps={{ icon: 'Bell', size: 24 }}
        title={t('post:post_menu_turn_off_noti')}
        onPress={onPress}
      />
      <PrimaryItem
        testID="post_view_menu.history"
        style={styles.item}
        leftIcon="RotateRight"
        leftIconProps={{ icon: 'RotateRight', size: 24 }}
        title={t('post:post_menu_history')}
        onPress={onPress}
      />
      {isActor && (
        <PrimaryItem
          testID="post_view_menu.delete"
          style={styles.item}
          leftIcon="TrashCan"
          leftIconProps={{ icon: 'TrashCan', size: 24 }}
          title={t('post:post_menu_delete')}
          onPress={onPressDelete}
        />
      )}
      {!isActor && (
        <PrimaryItem
          testID="post_view_menu.report"
          style={styles.item}
          leftIcon="CircleInfo"
          leftIconProps={{ icon: 'CircleInfo', size: 24 }}
          title={t('post:post_menu_report')}
          onPress={onPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    height: 44,
    paddingHorizontal: spacing.padding.large,
  },
});

export default PostViewMenu;

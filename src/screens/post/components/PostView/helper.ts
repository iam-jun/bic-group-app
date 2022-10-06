import i18next from 'i18next';
import { isEmpty } from 'lodash';
import Clipboard from '@react-native-clipboard/clipboard';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import { getLink, LINK_POST } from '~/utils/link';
import { IReaction } from '~/interfaces/IPost';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import postActions from '~/storeRedux/post/actions';
import { Button } from '~/baseComponents';

export const getPostViewMenu = (
  reactionsCount: any,
  isActor: boolean,
  dispatch:any,
  rootNavigation: any,
  postId: string,
  isPostDetail: boolean,
  isDraftPost: boolean,
  handleDeletePostError: (listIdAudiences: string[]) => void,
) => {
  const onPressEdit = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation?.navigate?.(
      homeStack.createPost, {
        postId,
        replaceWithDetail: !isPostDetail,
      },
    );
  };

  const onPressEditSettings = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation?.navigate?.(
      homeStack.postSettings, { postId },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(
      LINK_POST, postId,
    ));
    dispatch(showHideToastMessage({ content: 'common:text_link_copied_to_clipboard' }));
  };

  const onPressViewReactions = () => {
    dispatch(modalActions.hideBottomList());
    const firstReact = Object.values(reactionsCount)[0] as IReaction;
    if (!!firstReact && !isEmpty(firstReact)) {
      const initReaction = Object.keys(firstReact)[0];
      const payload: IPayloadReactionDetailBottomSheet = {
        isOpen: true,
        reactionCounts: reactionsCount,
        initReaction,
        getDataParam: { target: 'POST', targetId: postId },
      };
      dispatch(modalActions.showReactionDetailBottomSheet(payload));
    }
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(
      modalActions.showAlert({
        title: i18next.t('post:title_delete_post'),
        content: i18next.t('post:content_delete_post'),
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        confirmBtnProps: { type: 'ghost' },
        onConfirm: () => dispatch(postActions.deletePost({
          id: postId,
          isDraftPost,
          callbackError: handleDeletePostError,
        })),
      }),
    );
  };

  const defaultData = [
    {
      id: 1,
      testID: 'post_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('post:post_menu_edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    }, {
      id: 2,
      testID: 'post_view_menu.edit_settings',
      leftIcon: 'Sliders',
      title: i18next.t('post:post_menu_edit_settings'),
      requireIsActor: true,
      onPress: onPressEditSettings,
    },
    {
      id: 3,
      testID: 'post_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 4,
      testID: 'post_view_menu.insights',
      leftIcon: 'iconReact',
      title: i18next.t('post:post_menu_view_reactions'),
      requireIsActor: false,
      requireReactionCounts: true,
      onPress: onPressViewReactions,
    }, {
      id: 5,
      testID: 'post_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:post_menu_delete'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
  ];
  const result = [];
  defaultData.forEach((item: any) => {
    if ((!item.requireIsActor && !item?.requireReactionCounts) || (item.requireIsActor && isActor)
     || (item?.requireReactionCounts && !!reactionsCount && !!Object.keys(reactionsCount)?.[0])) {
      result.push({ ...item });
    }
  });

  return result;
};

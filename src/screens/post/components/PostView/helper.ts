import i18next from 'i18next';
import { isEmpty } from 'lodash';
import Clipboard from '@react-native-clipboard/clipboard';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import { getLink, LINK_POST } from '~/utils/link';
import { IReaction } from '~/interfaces/IPost';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import postActions from '~/storeRedux/post/actions';

export const getPostViewMenu = (
  reactionsCount: any,
  isActor: boolean,
  dispatch:any,
  rootNavigation: any,
  postId: string,
  isPostDetail: boolean,
  getDataPromise: any,
  isDraftPost: boolean,
  handleDeltePostError: (listIdAudiences: string[]) => void,
) => {
  const onPress = () => {
    dispatch(modalActions.hideBottomSelectionList());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressEdit = () => {
    dispatch(modalActions.hideBottomSelectionList());
    rootNavigation?.navigate?.(
      homeStack.createPost, {
        postId,
        replaceWithDetail: !isPostDetail,
      },
    );
  };

  const onPressEditSettings = () => {
    dispatch(modalActions.hideBottomSelectionList());
    rootNavigation?.navigate?.(
      homeStack.postSettings, { postId },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomSelectionList());
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
    dispatch(modalActions.hideBottomSelectionList());
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

  const onPressDelete = () => {
    dispatch(modalActions.hideBottomSelectionList());
    dispatch(
      modalActions.showAlert({
        title: i18next.t('post:title_delete_post'),
        content: i18next.t('post:content_delete_post'),
        iconName: 'TrashCan',
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        onConfirm: () => dispatch(postActions.deletePost({
          id: postId,
          isDraftPost,
          callbackError: handleDeltePostError,
        })),
      }),
    );
  };

  const defaultData = [
    {
      id: 1,
      testID: 'post_view_menu.edit',
      leftIcon: 'edit',
      title: i18next.t('post:post_menu_edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    }, {
      id: 2,
      testID: 'post_view_menu.edit_settings',
      leftIcon: 'SlidersUp',
      title: i18next.t('post:post_menu_edit_settings'),
      requireIsActor: true,
      onPress: onPressEditSettings,
    },
    {
      id: 3,
      testID: 'post_view_menu.copy',
      leftIcon: 'Copy',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,

    }, {
      id: 4,
      testID: 'post_view_menu.bookmark',
      leftIcon: 'Bookmark',
      title: i18next.t('post:post_menu_save'),
      requireIsActor: false,
      onPress,
    },
    {
      id: 5,
      testID: 'post_view_menu.insights',
      leftIcon: 'iconReact',
      title: i18next.t('post:post_menu_view_reactions'),
      requireIsActor: false,
      requireReactionCounts: true,
      onPress: onPressViewReactions,
    }, {
      id: 6,
      testID: 'post_view_menu.noti',
      leftIcon: 'Bell',
      title: i18next.t('post:post_menu_turn_off_noti'),
      requireIsActor: false,
      onPress,
    },
    {
      id: 7,
      testID: 'post_view_menu.history',
      leftIcon: 'RotateRight',
      title: i18next.t('post:post_menu_history'),
      requireIsActor: false,
      onPress,
    }, {
      id: 8,
      testID: 'post_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:post_menu_delete'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
    {
      id: 9,
      testID: 'post_view_menu.report',
      leftIcon: 'CircleInfo',
      title: i18next.t('post:post_menu_report'),
      requireIsActor: false,
      onPress,
    },
  ]
  const result = [];
  defaultData.forEach((item: any) => {
    if ((!item.requireIsActor && !item?.requireReactionCounts) || (item.requireIsActor && isActor)
     || (item?.requireReactionCounts && !!reactionsCount && !!Object.keys(reactionsCount)?.[0])) {
      result.push({ ...item });
    }
  })

  return result;
}

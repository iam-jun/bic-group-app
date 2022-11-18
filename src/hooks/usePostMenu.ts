import i18next from 'i18next';
import { isEmpty } from 'lodash';
import Clipboard from '@react-native-clipboard/clipboard';

import { useDispatch } from 'react-redux';
import { Keyboard } from 'react-native';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import { getLink, LINK_POST } from '~/utils/link';
import { IPost, IReaction } from '~/interfaces/IPost';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import postActions from '~/storeRedux/post/actions';
import { Button } from '~/baseComponents';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import useCommonController from '~/screens/store';
import { getPostMenus } from '~/helpers/post';

const usePostMenu = (
  data: IPost,
  isActor: boolean,
  isPostDetail: boolean,
  handleDeletePostError: (listAudiences: string[]) => void,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  const commonActions = useCommonController((state) => state.actions);

  if (!data) return null;

  const {
    id: postId, isDraft, reactionsCount, isSaved, type,
  } = data;

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

  const onPressSave = () => {
    dispatch(modalActions.hideBottomList());
    if (isSaved) {
      commonActions.unsavePost(postId, type);
    } else {
      commonActions.savePost(postId, type);
    }
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
        reactionsCount,
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
          isDraftPost: isDraft,
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
      testID: 'post_view_menu.save_unsave',
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(`post:post_menu_${isSaved ? 'unsave' : 'save'}`),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 4,
      testID: 'post_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,
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
      testID: 'post_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:post_menu_delete'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
  ];

  const menus = getPostMenus(defaultData, isActor, reactionsCount);

  const showMenu = () => {
    Keyboard.dismiss();
    dispatch(
      modalActions.showBottomList({ isOpen: true, data: menus } as BottomListProps),
    );
  };

  return {
    showMenu,
  };
};

export default usePostMenu;

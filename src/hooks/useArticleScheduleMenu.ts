import i18next from 'i18next';
import { Keyboard } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import { getPostMenus } from '~/helpers/post';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useArticleController from '~/screens/articles/store';
import showAlert from '~/store/helper/showAlert';
import Button from '~/baseComponents/Button';
import useModalStore from '~/store/modal';

const useArticleScheduleMenu = (
  data: IPost,
  isActor: boolean,
) => {
  const { rootNavigation } = useRootNavigation();
  const modalActions = useModalStore((state) => state.actions);

  if (!data) return null;

  const { id: articleId, reactionsCount } = data;

  const onPressEdit = () => {
    modalActions.hideBottomList();
    rootNavigation.replace(articleStack.createArticle, { articleId, isFromReviewSchedule: true });
  };

  const onDelete = () => {
    modalActions.hideBottomList();
    showAlert({
      title: i18next.t('article:menu:delete'),
      content: i18next.t('post:content_delete_article'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => {
        useArticleController.getState().actions.deleteArticle(
          articleId,
        );
      },
    });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'article_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('article:menu:edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    },
    // {
    //   id: 2,
    //   testID: 'article_view_menu.copy',
    //   leftIcon: 'LinkHorizontal',
    //   title: i18next.t('article:menu:copy_link'),
    //   requireIsActor: false,
    //   onPress,
    // },
    {
      id: 3,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('article:menu:delete'),
      requireIsActor: true,
      onPress: onDelete,
    },
  ];

  const menus = getPostMenus(defaultData, isActor, reactionsCount);

  const showMenu = () => {
    Keyboard.dismiss();
    modalActions.showBottomList({ data: menus } as BottomListProps);
  };

  return {
    showMenu,
  };
};

export default useArticleScheduleMenu;

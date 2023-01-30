import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import { Keyboard } from 'react-native';
import modalActions from '~/storeRedux/modal/actions';
import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import { getPostMenus } from '~/helpers/post';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const useArticleScheduleMenu = (
  data: IPost,
  isActor: boolean,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  if (!data) return null;

  const { id: articleId, reactionsCount } = data;

  const onPressEdit = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.replace(articleStack.createArticle, { articleId, isFromReviewSchedule: true });
  };

  const onPress = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(modalActions.showAlertNewFeature());
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
    {
      id: 2,
      testID: 'article_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('article:menu:copy_link'),
      requireIsActor: false,
      onPress,
    },
    {
      id: 3,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('article:menu:delete'),
      requireIsActor: true,
      onPress,
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

export default useArticleScheduleMenu;

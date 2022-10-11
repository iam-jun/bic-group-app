import i18next from 'i18next';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

export const getArticleViewMenu = (isActor: boolean) => {
  const onPress = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    Store.store.dispatch(modalActions.showAlertNewFeature());
  };

  const defaultData = [
    {
      id: 1,
      testID: 'article_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('post:article_menu:edit'),
      requireIsActor: true,
      onPress,
    },
    {
      id: 2,
      testID: 'article_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:article_menu:copy_link'),
      requireIsActor: false,
      onPress,
    },
    {
      id: 3,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:article_menu:delete'),
      requireIsActor: true,
      onPress,
    },
  ];

  const result = [];
  defaultData.forEach((item: any) => {
    if ((!item.requireIsActor) || (item.requireIsActor && isActor)) {
      result.push({ ...item });
    }
  });

  return result;
};

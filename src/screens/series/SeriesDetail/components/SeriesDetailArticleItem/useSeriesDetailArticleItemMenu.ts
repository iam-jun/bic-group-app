import i18next from 'i18next';

import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import useSeriesDetailArticleItemStore, { ISeriesDetailArticleItemState } from './store';
import useModalStore from '~/store/modal';

const useSeriesDetailArticleItemMenu = (
  seriesId: string, articleId: string,
) => {
  const { rootNavigation } = useRootNavigation();
  const modalActions = useModalStore((state) => state.actions);

  const actions = useSeriesDetailArticleItemStore((state: ISeriesDetailArticleItemState) => state.actions);

  const onPress = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('post:series_detail_article_menu:delete'),
      content: i18next.t('series:text_remove_article'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_remove'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteArticle(seriesId, articleId);
      },
      confirmBtnProps: { type: 'ghost' },
    });
  };

  const onPressReorder = () => {
    modalActions.hideBottomList();
    rootNavigation.navigate(seriesStack.reorderArticles, { seriesId });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'series_detail_article_item_menu.reoder',
      title: i18next.t('post:series_detail_article_menu:reorder'),
      onPress: onPressReorder,
    },
    {
      id: 2,
      testID: 'series_detail_article_item_menu.delete',
      title: i18next.t('post:series_detail_article_menu:delete'),
      onPress,
    },
  ];

  const showMenu = () => {
    modalActions.showBottomList({ data: defaultData } as any);
  };

  return {
    showMenu,
  };
};

export default useSeriesDetailArticleItemMenu;

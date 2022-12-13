import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import useSeriesDetailArticleItemStore, { ISeriesDetailArticleItemState } from './store';

const useSeriesDetailArticleItemMenu = (
  seriesId: string, articleId: string,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  const actions = useSeriesDetailArticleItemStore((state: ISeriesDetailArticleItemState) => state.actions);

  const onPress = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    Store.store.dispatch(modalActions.showAlert({
      title: i18next.t('post:series_detail_article_menu:delete'),
      content: i18next.t('series:text_remove_article'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_remove'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteArticle(seriesId, articleId);
      },
      confirmBtnProps: { type: 'ghost' },
    }));
  };

  const onPressReorder = () => {
    Store.store.dispatch(modalActions.hideBottomList());
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
    dispatch(
      modalActions.showBottomList({ isOpen: true, data: defaultData } as any),
    );
  };

  return {
    showMenu,
  };
};

export default useSeriesDetailArticleItemMenu;

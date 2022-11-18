import i18next from 'i18next';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';

export const getSeriesDetailArticleItemMenu = (
  {
    isActor,
    seriesId,
    // articleId,
    navigation,
  }: {isActor: boolean, articleId: string, navigation: any, seriesId: string},
) => {
  const onPress = () => {
    // do something
  };

  const onPressReorder = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    navigation.navigate(seriesStack.reorderArticles, { seriesId });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'series_detail_article_item_menu.reoder',
      title: i18next.t('post:series_detail_article_menu:reorder'),
      requireIsActor: false,
      onPress: onPressReorder,
    },
    {
      id: 2,
      testID: 'series_detail_article_item_menu.delete',
      title: i18next.t('post:series_detail_article_menu:delete'),
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

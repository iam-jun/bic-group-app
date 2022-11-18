import i18next from 'i18next';

export const getSeriesDetailArticleItemMenu = (
  {
    isActor,
    // articleId,
    // navigation
  }: {isActor: boolean, articleId: string, navigation: any},
) => {
  const onPress = () => {
    // do something
  };

  const defaultData = [
    {
      id: 1,
      testID: 'series_detail_article_item_menu.reoder',
      title: i18next.t('post:series_detail_article_menu:reorder'),
      requireIsActor: false,
      onPress,
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

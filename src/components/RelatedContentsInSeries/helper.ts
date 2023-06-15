import { IPost, PostType } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { rootNavigationRef } from '~/router/refs';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

const navigation = withNavigation(rootNavigationRef);

export const getPrevAndNextContentInSeries = (
  postId: string,
  series: IPost,
) => {
  const seriesDefault: IPost = { ...series, title: 'Series Index' };
  const { items } = series;

  const hasContent = items && items.some((item) => item.id === postId);

  if (!hasContent) return;

  const indexContent = items.findIndex((item) => item.id === postId);

  const prevContent
    = indexContent === 0 ? seriesDefault : items[indexContent - 1];
  const nextContent
    = items.length === 1
      ? null
      : indexContent === items.length - 1
        ? seriesDefault
        : items[indexContent + 1];

  return {
    prevContent,
    nextContent,
  };
};

export const goToContentInseries = (content: IPost) => {
  if (!content) return;

  const { type, id } = content;

  if (type === PostType.POST) {
    navigation.replace(homeStack.postDetail, { post_id: id });
  }

  if (type === PostType.ARTICLE) {
    navigation.replace(articleStack.articleContentDetail, { articleId: id });
  }

  if (type === PostType.SERIES) {
    navigation.replace(seriesStack.seriesDetail, { seriesId: id });
  }
};

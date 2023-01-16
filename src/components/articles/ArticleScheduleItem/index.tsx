import React from 'react';
import { IPost } from '~/interfaces/IPost';
import { Button } from '~/baseComponents';
import ContentArticle from './ContentArticle';
import { ArticleBoxScheduleTime } from '~/components/articles';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

interface ArticleScheduleItemProps {
    data: IPost;
}

const ArticleScheduleItem: React.FC<ArticleScheduleItemProps> = ({ data }) => {
  const { rootNavigation } = useRootNavigation();

  const {
    title,
    coverMedia,
    summary,
    actor,
    id,
    audience,
    publishedAt,
    status,
  } = data || {};

  const goToArticleReviewSchedule = () => {
    rootNavigation.navigate(articleStack.articleReviewSchedule, { articleId: id });
  };

  return (
    <Button onPress={goToArticleReviewSchedule}>
      <ArticleBoxScheduleTime
        publishedAt={publishedAt}
        status={status}
      />
      <ContentArticle
        title={title}
        actor={actor}
        audience={audience}
        coverMedia={coverMedia}
        summary={summary}
        showAvatar={false}
      />
    </Button>
  );
};

export default ArticleScheduleItem;

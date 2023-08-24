import React, { useCallback } from 'react';
import { PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { PostView, PostViewProps } from '../posts';
import SeriesItem from '../series/SeriesItem';
import ArticleItem from '~/components/articles/ArticleItem';

export interface ContentItemProps extends Partial<PostViewProps> {
  id?: string;
  testID?: string;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  hasReactPermission?: boolean;
  shouldHideBannerImportant?: boolean;
  shouldShowDraftQuiz?: boolean;
}

const ContentItem = ({
  id,
  shouldHideBannerImportant,
  shouldShowDraftQuiz,
  ...props
}: ContentItemProps) => {
  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));

  if (data?.type === PostType.ARTICLE) {
    return (
      <ArticleItem
        data={data}
        shouldHideBannerImportant={shouldHideBannerImportant}
        shouldShowDraftQuiz={shouldShowDraftQuiz}
      />
    );
  }

  if (data?.type === PostType.SERIES) {
    return <SeriesItem data={data} />;
  }

  return (
    <PostView
      {...props}
      data={data}
      shouldHideBannerImportant={shouldHideBannerImportant}
      shouldShowDraftQuiz={shouldShowDraftQuiz}
    />
  );
};

export default ContentItem;

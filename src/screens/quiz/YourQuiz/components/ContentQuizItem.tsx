import React, { useCallback } from 'react';
import { PostType } from '~/interfaces/IPost';

import QuizPostView from '~/screens/quiz/YourQuiz/components/QuizPostView';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

interface ContentQuizItemProps {
  contentId: string;
}

const ContentQuizItem: React.FC<ContentQuizItemProps> = ({ contentId }) => {
  const data = usePostsStore(useCallback(postsSelector.getPost(contentId, {}), [contentId]));

  if (data?.deleted || data?.reported) {
    return null;
  }

  if (data?.type === PostType.ARTICLE) {
    return <></>;
  }

  return (<QuizPostView data={data} />);
};

export default ContentQuizItem;

import React, { useCallback } from 'react';
import { PostType } from '~/interfaces/IPost';
import PinArticleView from '../PinArticleView';
import PinSeriesView from '../PinSeriesView';
import PinPostView from '../PinPostView';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

interface PinContentItemProps {
  contentId: string;
  isAdmin?: boolean;
  id: string;
  isActiveAnimation?: boolean;
}

const PinContentItem: React.FC<PinContentItemProps> = ({
  contentId,
  isAdmin,
  id,
  isActiveAnimation,
}) => {
  const data = usePostsStore(useCallback(postsSelector.getPost(contentId, {}), [contentId]));

  if (data?.deleted || data?.reported) {
    return null;
  }

  if (data?.type === PostType.ARTICLE) {
    return <PinArticleView data={data} isAdmin={isAdmin} id={id} isActiveAnimation={isActiveAnimation} />;
  }

  if (data?.type === PostType.SERIES) {
    return <PinSeriesView data={data} isAdmin={isAdmin} id={id} isActiveAnimation={isActiveAnimation} />;
  }

  return <PinPostView data={data} isAdmin={isAdmin} id={id} isActiveAnimation={isActiveAnimation} />;
};

export default PinContentItem;

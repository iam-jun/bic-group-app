import React from 'react';
import { IPost, PostType } from '~/interfaces/IPost';
import PinArticleView from '../PinArticleView';
import PinSeriesView from '../PinSeriesView';
import PinPostView from '../PinPostView';

interface PinContentItemProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
}

const PinContentItem: React.FC<PinContentItemProps> = ({
  data,
  isAdmin,
  id,
}) => {
  if (data?.type === PostType.ARTICLE) {
    return <PinArticleView data={data} isAdmin={isAdmin} id={id} />;
  }

  if (data?.type === PostType.SERIES) {
    return <PinSeriesView data={data} isAdmin={isAdmin} id={id} />;
  }

  return <PinPostView data={data} isAdmin={isAdmin} id={id} />;
};

export default PinContentItem;

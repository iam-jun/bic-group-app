import React from 'react';
import { IPost, PostType } from '~/interfaces/IPost';
import PinArticleView from '../PinArticleView';
import PinSeriesView from '../PinSeriesView';
import PinPostView from '../PinPostView';

interface PinContentItemProps {
    data: IPost;
}

const PinContentItem: React.FC<PinContentItemProps> = ({
  data,
}) => {
  if (data?.type === PostType.ARTICLE) {
    return <PinArticleView data={data} />;
  }

  if (data?.type === PostType.SERIES) {
    return <PinSeriesView data={data} />;
  }

  return <PinPostView data={data} />;
};

export default PinContentItem;

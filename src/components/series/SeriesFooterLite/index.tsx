import React, { FC } from 'react';
import { ContentFooterLite } from '~/components/ContentView';
import { getTotalReactions } from '~/helpers/post';
import { IPost } from '~/interfaces/IPost';
import { formatLargeNumber } from '~/utils/formatData';

type SeriesFooterLiteProps = {
    series: IPost;
}

const SeriesFooterLite: FC<SeriesFooterLiteProps> = ({ series }) => {
  const {
    id, reactionsCount, commentsCount, totalUsersSeen,
  } = series;

  const numberOfReactions = formatLargeNumber(
    getTotalReactions(reactionsCount, 'user'),
  );

  return (
    <ContentFooterLite
      id={id}
      reactionsCount={Number(numberOfReactions)}
      commentsCount={commentsCount}
      totalUsersSeen={totalUsersSeen}
    />
  );
};

export default SeriesFooterLite;

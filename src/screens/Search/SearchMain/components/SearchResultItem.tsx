import React, { FC } from 'react';
import useSearchStore from '../../store';
import { PostType } from '~/interfaces/IPost';
import { ArticleItem } from '~/components/articles';
import SeriesItem from '~/components/series/SeriesItem';
import { PostView } from '~/components/posts';

type SearchResultItemProps = {
  id: string;
};

const SearchResultItem: FC<SearchResultItemProps> = ({ id }) => {
  const content = useSearchStore((state) => state.content[id]);

  if (!content) return null;

  if (content.type === PostType.ARTICLE) {
    return <ArticleItem isLite data={content} />;
  }

  if (content.type === PostType.SERIES) {
    return <SeriesItem data={content} isLite />;
  }

  return <PostView isLite data={content} pressNavigateToDetail />;
};

export default SearchResultItem;

import React from 'react';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/components/ContentFooter';

export interface Props extends ContentFooterProps {
  articleId: string;
}

const ArticleFooter = ({ articleId, ...props }: Props) => (
  <ContentFooter
    {...props}
  />
);

export default ArticleFooter;

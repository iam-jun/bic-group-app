import React from 'react';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/components/ContentFooter';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

export interface Props extends ContentFooterProps {
  articleId: string;
}

const ArticleFooter = ({ articleId, onPressComment, ...props }: Props) => {
  const { rootNavigation } = useRootNavigation();

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(articleId);
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId, focusComment: true });
    }
  };

  return (
    <ContentFooter
      {...props}
      onPressComment={_onPressComment}
    />
  );
};

export default ArticleFooter;

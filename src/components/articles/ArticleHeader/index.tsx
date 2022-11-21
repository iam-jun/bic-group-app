import React, { FC } from 'react';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { IPost } from '~/interfaces/IPost';
import useArticleMenu from '~/hooks/useArticleMenu';

export interface ArticleHeaderProps extends ContentHeaderProps {
  data: IPost;
}

const ArticleHeader: FC<ArticleHeaderProps> = ({
  data,
  actor,
  disabled = false,
  onPressHeader,
  ...props
}) => {
  const { rootNavigation } = useRootNavigation();
  const userId = useUserIdAuth();
  const isCreator = actor?.id == userId;

  const _onPressHeader = () => {
    const { id: articleId } = data;
    if (onPressHeader) {
      onPressHeader?.(articleId);
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId });
    }
  };

  const { showMenu } = useArticleMenu(data, isCreator);

  return (
    <ContentHeader
      {...props}
      actor={actor}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={showMenu}
    />
  );
};

export default ArticleHeader;

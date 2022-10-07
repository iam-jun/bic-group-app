import React, { FC } from 'react';
import ContentHeader, { ContentHeaderProps } from '~/components/ContentHeader';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

interface Props extends ContentHeaderProps {
    articleId: string
}

const ArticleHeader: FC<Props> = ({
  articleId,
  disabled = false,
  onPressMenu,
  onPressHeader,
  ...props
}) => {
  const { rootNavigation } = useRootNavigation();

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.();
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId });
    }
  };

  return (
    <ContentHeader
      {...props}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={onPressMenu}
    />
  );
};

export default ArticleHeader;

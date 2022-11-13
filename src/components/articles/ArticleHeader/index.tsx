import React, { FC } from 'react';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { BottomListProps } from '~/components/BottomList';

import { ContentHeader, ContentHeaderProps } from '~/components/ContentView';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import modalActions from '~/storeRedux/modal/actions';
import { getArticleViewMenu } from '~/helpers/article';

export interface ArticleHeaderProps extends ContentHeaderProps {
  articleId: string
}

const ArticleHeader: FC<ArticleHeaderProps> = ({
  articleId,
  actor,
  disabled = false,
  onPressHeader,
  ...props
}) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const userId = useUserIdAuth();
  const isCreator = actor?.id == userId;

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.(articleId);
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId });
    }
  };

  const onPressMenu = () => {
    Keyboard.dismiss();
    const data = getArticleViewMenu({ isActor: isCreator, articleId, navigation: rootNavigation });
    dispatch(
      modalActions.showBottomList({ isOpen: true, data } as BottomListProps),
    );
  };

  return (
    <ContentHeader
      {...props}
      actor={actor}
      disabled={disabled}
      onPressHeader={_onPressHeader}
      onPressMenu={onPressMenu}
    />
  );
};

export default ArticleHeader;

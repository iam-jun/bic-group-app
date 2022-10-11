import React, { FC } from 'react';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { BottomListProps } from '~/components/BottomList';

import ContentHeader, { ContentHeaderProps } from '~/components/ContentView/components/ContentHeader';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import modalActions from '~/storeRedux/modal/actions';
import { getArticleViewMenu } from './helper';

interface Props extends ContentHeaderProps {
  articleId: string
}

const ArticleHeader: FC<Props> = ({
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
    const data = getArticleViewMenu(isCreator);
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

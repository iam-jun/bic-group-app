import React from 'react';

import ContentHeader, { ContentHeaderProps } from '~/components/ContentView/components/ContentHeader';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

interface Props extends ContentHeaderProps {
  postId: string
}

const PostViewHeader = ({
  postId,
  disabled = false,
  onPressMenu,
  onPressHeader,
  ...props
}: Props) => {
  const { rootNavigation } = useRootNavigation();

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });
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

export default PostViewHeader;

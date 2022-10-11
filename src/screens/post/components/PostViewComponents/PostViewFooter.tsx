import React, { FC } from 'react';

import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/components/ContentFooter';

export interface Props extends ContentFooterProps {
  postId: string;
}

const PostViewFooter: FC<Props> = ({
  postId,
  onPressComment,
  ...props
}: Props) => {
  const { rootNavigation } = useRootNavigation();

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, {
        post_id: postId,
        focus_comment: true,
      });
    }
  };

  return (
    <ContentFooter
      {...props}
      onPressComment={_onPressComment}
    />
  );
};

export default PostViewFooter;

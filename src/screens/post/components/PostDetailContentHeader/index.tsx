import React from 'react';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { padding } from '~/theme/spacing';
import LoadMoreComment from '../LoadMoreComment';
import PostView from '../PostView';

const PostDetailContentHeader = ({
  id,
  onPressComment,
  onContentLayout,
  commentLeft,
  idLessThan,
}: any) => {
  if (!id) {
    return null;
  }
  return (
    <>
      <ViewSpacing height={padding.large} />
      <PostView
        postId={id}
        onPressComment={onPressComment}
        onContentLayout={onContentLayout}
        isPostDetail
        btnReactTestID="post_detail_content.btn_react"
        btnCommentTestID="post_detail_content.btn_comment"
      />
      <Divider />
      {commentLeft && (
        <LoadMoreComment
          title="post:text_load_more_comments"
          postId={id}
          idLessThan={idLessThan}
        />
      )}
    </>
  );
};

export default PostDetailContentHeader;

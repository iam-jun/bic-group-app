import React, { useCallback } from 'react';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { padding } from '~/theme/spacing';
import LoadMoreComment from '~/components/LoadMoreComment';
import { PostView } from '~/components/posts';

const PostDetailContentHeader = ({
  id,
  onPressComment,
  onContentLayout,
  commentLeft,
  idLessThan,
}: any) => {
  const postData = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));
  const isHidden = usePostsStore(useCallback(postsSelector.getIsHidden(id), [id]));

  if (!postData) {
    return null;
  }

  return (
    <>
      <ViewSpacing height={padding.large} />
      <PostView
        testID="post_view"
        isPostDetail
        data={postData}
        hasReactPermission={!isHidden}
        onPressComment={onPressComment}
        onContentLayout={onContentLayout}
        btnReactTestID="post_detail_content.btn_react"
        btnCommentTestID="post_detail_content.btn_comment"
      />
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

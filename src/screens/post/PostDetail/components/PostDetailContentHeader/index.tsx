import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import spacing, { padding } from '~/theme/spacing';
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
  const isReported = usePostsStore(useCallback(postsSelector.getIsReported(id), [id]));

  if (!postData) {
    return null;
  }

  return (
    <>
      <ViewSpacing height={padding.large} />
      <PostView
        isPostDetail
        data={postData}
        hasReactPermission={!isReported}
        onPressComment={onPressComment}
        onContentLayout={onContentLayout}
        btnReactTestID="post_detail_content.btn_react"
        btnCommentTestID="post_detail_content.btn_comment"
      />
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
      </View>
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

const styles = StyleSheet.create({
  dividerContainer: {
    backgroundColor: '#fff',
  },
  divider: {
    marginHorizontal: spacing.margin.large,
  },
});

export default PostDetailContentHeader;

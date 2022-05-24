export const NOTIFICATION_TYPE = {
  POST: {
    /**
     * Post created in single group
     */
    CREATED_IN_ONE_GROUP: 'post.to_post_created_in_one_group',

    /**
     * Post created in multi group
     */
    CREATED_IN_MULTIPLE_GROUPS: 'post.to_post_created_in_multiple_groups',

    IMPORTANT: {
      /**
       * Post created in single group
       */
      CREATED_IN_ONE_GROUP: 'post.important.to_post_created_in_one_group',

      /**
       * Post created in multi group
       */
      CREATED_IN_MULTIPLE_GROUPS:
        'post.important.to_post_created_in_multiple_groups',
    },
    /**
     * Mention users in a post in one group
     */
    MENTION_IN_ONE_GROUP: 'post.to_mention_in_post_in_one_group',

    /**
     * Mention users in a post in multiple groups
     */
    MENTION_IN_MULTIPLE_GROUPS: 'post.to_mention_in_post_in_multiple_groups',

    VIDEO: {
      /**
       * send notification to post owner when a video post is under processing
       */
      PROCESSING: 'post.video_processing',
      /**
       * send notification to post owner when a video post is published
       */
      PUBLISHED: 'post.video_published',
      /**
       * send notification to post owner when a video post processing is failed
       */
      FAILED: 'post.video_failed',
    },
  },
  COMMENT: {
    /**
     * send notification to post owner when other users commented on the post
     */
    POST_CREATOR: 'comment.to_post_creator',

    /**
     * Comment created for mentioned user in post
     */
    USER_MENTIONED_IN_POST: 'comment.to_user_mentioned_in_post',

    /**
     * Comment created for commented user
     */
    USER_COMMENTED_ON_POST: 'comment.to_user_commented_on_post',

    /**
     * Notification for comment creator when the comment was replied
     */
    CREATOR_OF_THE_PARENT_COMMENT: 'comment.to_creator_of_the_parent_comment',
    /**
     * Notification for comment creator when the comment was replied by multiple people
     */
    CREATOR_OF_THE_PARENT_COMMENT_AGGREGATED:
      'comment.to_creator_of_the_parent_comment_aggregated',

    /**
     * Comment created for commented reply user
     */
    USER_REPLIED_TO_THE_SAME_PARENT_COMMENT:
      'comment.to_user_reply_to_the_same_parent_comment',
    USER_REPLIED_TO_THE_SAME_PARENT_COMMENT_AGGREGATED:
      'comment.to_user_reply_to_the_same_parent_comment_aggregated',
    /**
     * Comment created for mentioned user in comment
     */
    USER_MENTIONED_IN_PREV_COMMENT: 'comment.to_user_mentioned_in_prev_comment',

    /**
     *
     */
    USER_MENTIONED_IN_COMMENT: 'comment.to_user_mentioned_in_comment',
    /**
     *
     */
    USER_MENTIONED_IN_REPLIED_COMMENT:
      'comment.to_user_mentioned_in_replied_comment',

    /**
     *
     */
    USER_MENTIONED_IN_PREV_REPLIED_COMMENT:
      'comment.to_user_mentioned_in_prev_replied_comment',

    /**
     *
     */
    USER_MENTIONED_IN_PARENT_COMMENT:
      'comment.to_user_mentioned_in_parent_comment',
    USER_MENTIONED_IN_PARENT_COMMENT_AGGREGATED:
      'comment.to_user_mentioned_in_parent_comment_aggregated',
  },
  REACT: {
    POST_CREATOR: 'react.post_creator',
    POST_CREATOR_AGGREGATED: 'react.post_creator_aggregated',
    COMMENT_CREATOR: 'react.comment_creator',
    COMMENT_CREATOR_AGGREGATED: 'react.comment_creator_aggregated',
  },
};

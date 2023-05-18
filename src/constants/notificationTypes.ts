export const NOTIFICATION_TYPE = {
  /**
   * When a user created a post with video and processed video unsuccessful
   */
  POST_VIDEO_TO_USER_UNSUCCESSFUL: 'post.video.to_user.unsuccessful',

  /**
   * When a user created a post with video and processed video successful
   */
  POST_VIDEO_TO_USER_SUCCESSFUL: 'post.video.to_user.successful',

  /**
   * When a user created post and chose only one group audience
   */
  POST_TO_USER_IN_ONE_GROUP: 'post.to_user.in_one_group',

  /**
   * When a user created a post and chose more than one group audience
   */
  POST_TO_USER_IN_MULTIPLE_GROUPS: 'post.to_user.in_multiple_groups',

  /**
   * When a user created a post with mentioned user and chose only one group audience
   */
  POST_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
    'post.to_mentioned_user.in_post_in_one_group',

  /**
   * When a user created a post with mentioned user and chose more than one group audience
   */
  POST_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
    'post.to_mentioned_user.in_post_in_multiple_groups',

  /**
   * When a user created a post, marked it as important and chose only one group audience
   */
  POST_IMPORTANT_TO_USER_IN_ONE_GROUP: 'post.important.to_user.in_one_group',

  /**
   * When a user created a post, marked it as important and chose more than one group audience
   */
  POST_IMPORTANT_TO_USER_IN_MULTIPLE_GROUPS:
    'post.important.to_user.in_multiple_groups',

  /**
   * When a user created a post with mentioned user, marked it as important and chose only one group audience
   */
  POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
    'post.important.to_mentioned_user.in_post_in_one_group',

  /**
   * When a user created a post with mentioned user, marked it as important and chose more than one group audience
   */
  POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
    'post.important.to_mentioned_user.in_post_in_multiple_groups',

  /**
   * When a user commented on someone's post
   */
  COMMENT_TO_POST_CREATOR: 'comment.to_post_creator',

  /**
   * When many users commented on someone's post
   */
  COMMENT_TO_POST_CREATOR_AGGREGATED: 'comment.to_post_creator.aggregated',

  /**
   * When a user commented on a post that someone is mentioned in
   */
  COMMENT_TO_MENTIONED_USER_IN_POST: 'comment.to_mentioned_user.in_post',

  /**
   * When many users commented on a post that someone is mentioned in
   */
  COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
    'comment.to_mentioned_user.in_post.aggregated',

  /**
   * when another user commented on a post you commented on before
   */
  COMMENT_TO_COMMENTED_USER_ON_POST: 'comment.to_commented_user.on_post',

  /**
   * When many other users commented on the post you commented on before
   */
  COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED:
    'comment.to_commented_user.on_post.aggregated',

  /**
   * When a user mentioned someone in a comment
   */
  COMMENT_TO_MENTIONED_USER_IN_COMMENT: 'comment.to_mentioned_user.in_comment',

  /**
   * When a user replied to a comment that someone is mentioned in
   */
  COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT:
    'comment.to_mentioned_user.in_parent_comment',

  /**
   * When multiple users replied to a comment that someone is mentioned in
   */
  COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT_AGGREGATED:
    'comment.to_mentioned_user.in_parent_comment.aggregated',

  /**
   * When a user replied to someone's comment
   */
  COMMENT_TO_PARENT_COMMENT_CREATOR: 'comment.to_parent_comment_creator',

  /**
   * When multiple users replied to someone's comment
   */
  COMMENT_TO_PARENT_COMMENT_CREATOR_AGGREGATED:
    'comment.to_parent_comment_creator.aggregated',

  /**
   * When another user replied to a comment that only you replied before
   * @using For in app notification
   */
  COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT:
    'comment.to_replied_user.in_the_same_parent_comment',

  /**
   * When another user replied to a comment that only you replied before
   * @using For out app notification
   */
  COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_PUSH:
    'comment.to_replied_user.in_the_same_parent_comment.push',

  /**
   * When many other users replied to the comment you replied before
   */
  COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_AGGREGATED:
    'comment.to_replied_user.in_the_same_parent_comment.aggregated',

  /**
   * When a user reacted to someone's post
   */
  REACTION_TO_POST_CREATOR: 'reaction.to_post_creator',

  /**
   * when many users reacted to someone's post
   */
  REACTION_TO_POST_CREATOR_AGGREGATED: 'reaction.to_post_creator.aggregated',

  /**
   * When a user reacted to someone's comment
   */
  REACTION_TO_COMMENT_CREATOR: 'reaction.to_comment_creator',

  /**
   * when many users reacted to someone's comment
   */
  REACTION_TO_COMMENT_CREATOR_AGGREGATED:
    'reaction.to_comment_creator.aggregated',

  /**
   * When a user requests to join someone's group
   */
  GROUP_JOIN_GROUP_TO_ADMIN: 'group.join_group.to_admin',

  /**
   * When many users request to join someone's group
   */
  GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED: 'group.join_group.to_admin.aggregated',

  /**
   * When the admin or owner of a group approved someone's request to join
   */
  GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
    'group.join_group.to_request_creator.approved',

  /**
   * When the admin or owner of a group rejected someone's request to join
   */
  GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
    'group.join_group.to_request_creator.rejected',

  /**
   * When the admin or owner of a group added someone to the group
   */
  GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
    'group.added_to_group.to_user.in_one_group',

  /**
   * When the admin or owner of a group added someone to multiple groups
   */
  GROUP_ADDED_TO_GROUP_TO_USER_IN_MULTIPLE_GROUPS:
    'group.added_to_group.to_user.in_multiple_groups',

  /**
   * When the admin or owner of a group removed someone from the group
   */
  GROUP_REMOVED_FROM_GROUP_TO_USER: 'group.removed_from_group.to_user',

  /**
   * When the owner of a group assigned any role to someone in the group
   */
  GROUP_ASSIGNED_ROLE_TO_USER: 'group.assigned_role.to_user',

  /**
   * When the owner of a group demoted any role to someone in the group
   */
  GROUP_DEMOTED_ROLE_TO_USER: 'group.demoted_role.to_user',

  /**
   * When admin changed the community/group privacy
   */
  GROUP_CHANGED_PRIVACY_TO_GROUP: 'group.changed_privacy.to_group',

  /**
   * Creator will receive a notification about his content was hidden
   * when a community admin decides to hide it from a community
   */
  CONTENT_HIDE_TO_USER: 'content.hide.to_user',

  /**
   * Com admin receives an in-app notification once a member has made a report
   */
  CONTENT_REPORT_TO_USER: 'content.report.to_user',

  /**
   * Aggregate notifications when multiple users report to the same content
   */
  CONTENT_REPORT_TO_USER_AGGREGATED: 'content.report.to_user.aggregated',

  /**
   * When a new article is added to a series by an article creator in a group that user is a member of that group
   */
  ADD_ARTICLE_TO_USER: 'add.article.to_user',

  /**
   * When a new article is created by someone in a group that user is also a member of that group (Single Group)
   */
  POST_ARTICLE_TO_USER_IN_ONE_GROUP: 'post.article.to_user.in_one_group',

  /**
   * When a new article is created by someone in a group that user is also a member of that group (Multiple Group)
   */
  POST_ARTICLE_TO_USER_IN_MULTIPLE_GROUPS: 'post.article.to_user.in_multiple_groups',

  /**
   * When a new series is created by someone in a group that user is a member of that group (Single Group)
   */
  POST_SERIES_TO_USER_IN_ONE_GROUP: 'post.series.to_user.in_one_group',

  /**
   * When a new series is created by someone in a group that user is a member of that group (Multiple Group)
   */
  POST_SERIES_TO_USER_IN_MULTIPLE_GROUPS: 'post.series.to_user.in_multiple_groups',

  /**
   * Com admin receives an in-app notification once a member has made a report
   */
  REPORT_USER_TO_USER: 'report.user.to_user',

  /**
   * Aggregate notifications when multiple users reported the same content
   */
  REPORT_USER_TO_USER_AGGREGATED: 'report.user.to_user.aggregated',

  /**
   * When community admin leave community.
   * notify for community owner
   */
  LEAVE_COMMUNITY_TO_USER: 'leave.community.to_user',

  /**
   * When group admin leave group.
   * notify for community owner
   */
  LEAVE_GROUP_TO_USER: 'leave.group.to_user',

  /**
   * When group admin leave multiple group
   * notify for community owner
   */
  LEAVE_MULTIPLE_GROUP_TO_USER: 'leave.multiple_group.to_user',

  /**
   * When new post was added to series
   */
  ADD_POST_TO_USER: 'add.post.to_user',

  /**
   * When post was removed from series
   */
  REMOVE_POST_TO_USER: 'remove.post.to_user',

  /**
   * When article was removed from series
   */
  REMOVE_ARTICLE_TO_USER: 'remove.article.to_user',

  /**
   * When series contain your content was deleted
   */
  DELETE_SERIES_TO_USER: 'delete.series.to_user',

  REMOVE_POST_TO_CREATOR: 'remove.post.to_creator',
  REMOVE_ARTICLE_TO_CREATOR: 'remove.article.creator',

  // maintenance notification
  SCHEDULED_MAINTENANCE_DOWNTIME: 'scheduled_maintenance_downtime',

  // approved kyc
  APPROVED_KYC: 'approved_kyc',
  // add content to series
  ADD_CONTENT_TO_USER: 'add.content.to_user',

  // add content to series in multiple group
  ADD_CONTENT_TO_USER_IN_MULTIPLE_GROUPS: 'add.content.to_user.in_multiple_group',

  // remove content from series
  SERIES_POST_ITEM_CHANGED: 'series_post_item_changed',
  SERIES_ARTICLE_ITEM_CHANGED: 'series_article_item_changed',
};

const Common = {
  SUCCESS: 'api.ok',
  SYSTEM_ISSUE: 0,
  MAINTENANCE: 'api.is_under_maintenance',
};

const Auth = {
  TOKEN_EXPIRED: 'app.auth_token.expired',
};

const Post = {
  COMMENT_DELETED: 'app.comment.reply.not_existing.app_error',
  COPIED_COMMENT_IS_DELETED: 'app.comment.not_existing.app_error',
  POST_PRIVACY: 'api.forbidden',
  POST_DELETED: 'content.not_found',
  VALIDATION_ERROR: 'api.validation_error', // invalid input send to backend
  TAG_SERIES_INVALID: 'tag_series_invalid', // invalid series or tags
  ARTICLE_INVALID_PARAM: 'app.article.invalid_parameter', // invalid series or tags of article
  CONTENT_NO_PIN_PERMISSION: 'content.no_pin_permission',
  CONTENT_AUDIENCE_NO_BELONG: 'content.audience_no_belong',
  CONTENT_GROUP_REQUIRED: 'content.group_join_required',
  POST_NO_READ_PERMISSION: 'post.no_read_permission',
  ARTICLE_NO_READ_PERMISSION: 'article.no_read_permission',
  COMMENT_IS_REPORTED_AND_DELETED: 'comment.reported_and_deleted',
  QUIZ_NO_CRUD_PERMISSION_AT_GROUP: 'quiz.no_crud_permission_at_group',
};

const Group = {
  SCHEME_NOT_FOUND: 'scheme.not_found',
  REVOKE_ACCOUNT_OWNER: 'community.revoke_account_owner',
  LAST_ADMIN_LEAVE: 'group.member.is_last_admin',
  ALREADY_MEMBER: 'group.already_member',
  JOIN_REQUEST_ALREADY_SENT: 'group.joining_request.already_sent',
  TERMS_NOT_FOUND: 'group_terms.get.not_found',
  MISSIING_MEMBERSHIP_ANSWERS: 'joining_request.missing.membership_answers',
};

const APIErrorCode = {
  Common,
  Auth,
  Post,
  Group,
};

export default APIErrorCode;

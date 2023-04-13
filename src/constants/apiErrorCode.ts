const Common = {
  SUCCESS: 'api.ok',
  SYSTEM_ISSUE: 0,
};

const Auth = {
  TOKEN_EXPIRED: 'app.auth_token.expired',
};

const Post = {
  COMMENT_DELETED: 'app.comment.reply.not_existing.app_error',
  COPIED_COMMENT_IS_DELETED: 'app.comment.not_existing.app_error',
  POST_PRIVACY: 'api.forbidden',
  POST_DELETED: 'app.post.not_existing.app_error',
  VALIDATION_ERROR: 'api.validation_error', // invalid input send to backend
  ARTICLE_INVALID_PARAM: 'app.article.invalid_parameter', // invalid series or tags of article
  POST_INVALID_PARAM: 'app.post.invalid_parameter', // invalid series or tags of posts
  CONTENT_NO_PIN_PERMISSION: 'content.no_pin_permission',
  CONTENT_AUDIENCE_NO_BELONG: 'content.audience_no_belong',
};

const Group = {
  SCHEME_NOT_FOUND: 'scheme.not_found',
  REVOKE_ACCOUNT_OWNER: 'community.revoke_account_owner',
  LAST_ADMIN_LEAVE: 'group.member.is_last_admin',
  ALREADY_MEMBER: 'group.already_member',
  JOIN_REQUEST_ALREADY_SENT: 'group.joining_request.already_sent',
  TERMS_NOT_FOUND: 'group_terms.get.not_found',
};

const APIErrorCode = {
  Common,
  Auth,
  Post,
  Group,
};

export default APIErrorCode;

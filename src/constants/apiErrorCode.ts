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
  VALIDATION_ERROR: 'api.validation_error',
};

const Group = {
  SCHEME_NOT_FOUND: 'scheme.not_found',
  REVOKE_ACCOUNT_OWNER: 'community.revoke_account_owner',
  LAST_ADMIN_LEAVE: 'group.member.is_last_admin',
};

const APIErrorCode = {
  Common,
  Auth,
  Post,
  Group,
};

export default APIErrorCode;

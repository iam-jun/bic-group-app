const COMMON = {
  SUCCESS: 'OK',
  SYSTEM_ISSUE: 0,
};

const AUTH = {
  TOKEN_EXPIRED: 'app.auth_token.expired',
};

const POST = {
  commentDeleted: 'app.comment.reply.not_existing.app_error',
  copiedCommentIsDeleted: 'app.comment.not_existing.app_error',
  postPrivacy: 'api.forbidden',
  postDeleted: 'app.post.not_existing.app_error',
  postCanNotCommentOrReact: 'api.validation_error',
};

const GROUP = {
  SCHEME_NOT_FOUND: 'scheme.not_found',
  REVOKE_ACCOUNT_OWNER: 'community.revoke_account_owner',
  LAST_ADMIN_LEAVE: 'group.member.is_last_admin',
};

const API_ERROR_CODE = {
  COMMON,
  AUTH,
  POST,
  GROUP,
};

export default API_ERROR_CODE;

const COMMON = {
  SYSTEM_ISSUE: 0,
};

const AUTH = {
  TOKEN_EXPIRED: 'app.auth_token.expired',
};

const POST = {
  commentDeleted: 'app.comment.reply.existing.app_error',
  copiedCommentIsDeleted: 'app.comment.not_found.app_error',
  postPrivacy: 'api.forbidden',
};

const GROUP = {};

const API_ERROR_CODE = {
  COMMON,
  AUTH,
  POST,
  GROUP,
};

export default API_ERROR_CODE;

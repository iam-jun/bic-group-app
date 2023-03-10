export const authErrors = {
  NOT_AUTHORIZED_EXCEPTION: 'NotAuthorizedException',
  CODE_MISMATCH_EXCEPTION: 'CodeMismatchException',
  LIMIT_EXCEEDED_EXCEPTION: 'LimitExceededException',
  EXPIRED_CODE_EXCEPTION: 'ExpiredCodeException',
  TOO_MANY_FAILED_ATTEMPTS_EXCEPTION: 'TooManyFailedAttemptsException',
  TOO_MANY_REQUESTS_EXCEPTION: 'TooManyRequestsException',
  USER_NOT_FOUND_EXCEPTION: 'UserNotFoundException',
  USER_EMAIL_EXISTED: 'user.email.existed',
  USER_USER_NAME_EXISTED: 'user.username.existed',
  USER_EXISTED: 'user.existed',
};

export const forgotPasswordStages = {
  INPUT_ID: 'INPUT_ID',
  INPUT_CODE_PW: 'INPUT_CODE_PW',
  COMPLETE: 'COMPLETE',
};

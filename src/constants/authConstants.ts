// eslint-disable-next-line import/no-extraneous-dependencies
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types/Auth';

export const oauthProviders = {
  FACEBOOK: CognitoHostedUIIdentityProvider.Facebook,
  GOOGLE: CognitoHostedUIIdentityProvider.Google,
  APPLE: CognitoHostedUIIdentityProvider.Apple,
};

export const authErrors = {
  NOT_AUTHORIZED_EXCEPTION: 'NotAuthorizedException',
  CODE_MISMATCH_EXCEPTION: 'CodeMismatchException',
  LIMIT_EXCEEDED_EXCEPTION: 'LimitExceededException',
  EXPIRED_CODE_EXCEPTION: 'ExpiredCodeException',
  TOO_MANY_FAILED_ATTEMPTS_EXCEPTION: 'TooManyFailedAttemptsException',
  TOO_MANY_REQUESTS_EXCEPTION: 'TooManyRequestsException',
  USER_NOT_FOUND_EXCEPTION: 'UserNotFoundException',
};

export const forgotPasswordStages = {
  INPUT_ID: 'INPUT_ID',
  INPUT_CODE_PW: 'INPUT_CODE_PW',
  COMPLETE: 'COMPLETE',
};

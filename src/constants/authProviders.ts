// eslint-disable-next-line import/no-extraneous-dependencies
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types/Auth';

export default {
  FACEBOOK: CognitoHostedUIIdentityProvider.Facebook,
  GOOGLE: CognitoHostedUIIdentityProvider.Google,
  APPLE: CognitoHostedUIIdentityProvider.Apple,
};

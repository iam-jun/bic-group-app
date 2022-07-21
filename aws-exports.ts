import { getEnv } from '~/utils/env';

const awsmobile = {
  aws_project_region: getEnv('BEIN_AWS_PROJECT_REGION'),
  // aws_cognito_identity_pool_id:
  //   'ap-southeast-1:c158f335-c3ed-480d-871c-dc672bde36ed',
  aws_cognito_region: getEnv('BEIN_AWS_COGNITO_REGION'),
  aws_user_pools_id: getEnv('BEIN_AWS_USER_POOLS_ID'),
  aws_user_pools_web_client_id: getEnv('BEIN_AWS_USER_POOLS_WEB_CLIENT_ID'),
  oauth: {
    // domain: 'bein.auth.ap-southeast-1.amazoncognito.com',
    // responseType: 'token',
    // scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    // redirectSignIn: 'bein://',
    // redirectSignOut: 'bein://',
  },
};

export default awsmobile;

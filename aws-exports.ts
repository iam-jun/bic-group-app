import getEnv from '~/utils/env';

const awsmobile = {
  aws_project_region: getEnv('BEIN_AWS_PROJECT_REGION'),
  aws_cognito_region: getEnv('BEIN_AWS_COGNITO_REGION'),
  aws_user_pools_id: getEnv('BEIN_AWS_USER_POOLS_ID'),
  aws_user_pools_web_client_id: getEnv('BEIN_AWS_USER_POOLS_WEB_CLIENT_ID'),
  oauth: {},
};

export default awsmobile;

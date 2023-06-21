import Smartlook from 'smartlook-react-native-wrapper';

import { APP_ENV } from '~/configs/appConfig';
import getEnv from '~/utils/env';

const appEnv = getEnv('APP_ENV');

const SmartlookProject = {
  STG: '',
  PRO: 'd4e471576fa08e5e5244858a18125d27fafddb74',
};

export const initSmartlook = () => {
  let token;
  if (appEnv === APP_ENV.STAGING) {
    token = SmartlookProject.STG;
  } else if (appEnv === APP_ENV.PRODUCTION) {
    token = SmartlookProject.PRO;
  }

  if (!token) return;

  Smartlook.setupAndStartRecording(token);
};

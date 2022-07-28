import * as Sentry from '@sentry/react-native';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';

const PROJECT_DSN = 'https://a69cedef20a54a25815edd9ab9ff8c92@o973991.ingest.sentry.io/5930517';

const CONFIG = {
  TRACES_SAMPLE_RATE: 0.2,
  TRACES_SAMPLE_RATE_TEST: 1,
};

const appVersion = getEnv('APP_VERSION');
const appEnv = getEnv('APP_ENV');
const ignoreSentry = appEnv !== APP_ENV.STAGING && appEnv !== APP_ENV.PRODUCTION;

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const initSentry = () => {
  if (ignoreSentry) return;
  Sentry.init({
    dsn: PROJECT_DSN,
    tracesSampleRate: CONFIG.TRACES_SAMPLE_RATE_TEST,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation,
      }),
    ],
  });

  Sentry.setTag(
    'app_version', appVersion,
  );
  Sentry.setTag(
    'app_env', appEnv,
  );
};

export const wrapWithSentry = (App: any) => {
  if (ignoreSentry) {
    return App;
  }
  return Sentry.wrap(App);
};

export const registerNavigationContainerWithSentry = (navigation: any) => {
  if (ignoreSentry) return;
  if (navigation) {
    routingInstrumentation.registerNavigationContainer(navigation);
  }
};

export const captureExceptionWithSentry = (error: any) => {
  if (ignoreSentry) return;
  Sentry.captureException(error);
};

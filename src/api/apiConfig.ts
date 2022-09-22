import { AxiosRequestConfig } from 'axios';

import getEnv from '~/utils/env';

const apiUrls = {
  GROUP: `${getEnv('BEIN_API')}/v1/group/`,
  FEED: `${getEnv('BEIN_API')}/v1/feed/`,
  NOTIFICATION: `${getEnv('BEIN_API')}/v1/notification/`,
  UPLOAD: `${getEnv('BEIN_API')}/v1/upload/`,
};

export const apiProviders = {
  bein: {
    url: apiUrls.GROUP,
    name: 'Bein',
  },
  beinFeed: {
    url: apiUrls.FEED,
    name: 'BeinFeed',
  },
  beinNotification: {
    url: apiUrls.NOTIFICATION,
    name: 'BeinNotification',
  },
  beinUpload: {
    url: apiUrls.UPLOAD,
    name: 'BeinUpload',
  },
};

export interface HttpApiRequestConfig extends AxiosRequestConfig {
  provider: Provider;
  useRetry: boolean;
}

export interface Provider {
  name: string;
  url: string;
}

export interface HttpApiResponseFormat {
  code: string | number;
  data?: any;
  meta?: any;
}

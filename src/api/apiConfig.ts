import { AxiosRequestConfig } from 'axios';

import getEnv from '~/utils/env';

export const apiProviders = {
  bein: {
    url: getEnv('BEIN_API'),
    name: 'Bein',
  },
  beinFeed: {
    url: getEnv('BEIN_FEED'),
    name: 'BeinFeed',
  },
  beinNotification: {
    url: `${getEnv('BEIN_NOTIFICATION')}`,
    name: 'BeinNotification',
  },
  beinUpload: {
    url: `${getEnv('BEIN_UPLOAD')}`,
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

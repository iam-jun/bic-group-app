import { Method } from 'axios';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';

import { withHttpRequestPromise } from '~/api/apiRequest';

const provider = apiProviders.beinMaintenance;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const maintenanceApiConfig = {
  checkMaintenance: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}`,
  }),
};

const maintenanceApi = {
  checkMaintenance: () => withHttpRequestPromise(maintenanceApiConfig.checkMaintenance),
};

export default maintenanceApi;

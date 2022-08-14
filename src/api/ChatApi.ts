import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
import { withHttpRequestPromise } from '~/api/apiRequest';

export const chatApiConfig = {
  init: (): HttpApiRequestConfig => ({
    url: `${apiProviders.bein.url}chat/channels/unread`,
    method: 'get',
    provider: apiProviders.bein,
    useRetry: true,
  }),
}

const chatApi = {
  init: () => withHttpRequestPromise(chatApiConfig.init),
}

export default chatApi

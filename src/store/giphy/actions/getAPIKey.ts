import streamApi from '~/api/StreamApi';
import { IGiphyState } from '..';

const getAPIKey = (set, _get) => async () => {
  try {
    const response = await streamApi.getGiphyAPIKey();

    set((state: IGiphyState) => {
      state.apiKey = response.data;
    }, 'initializeSuccess');
  } catch (error) {
    console.error('giphyStore getAPIKey error', error);
  }
};

export default getAPIKey;

import streamApi from '~/api/StreamApi';
import { IParamsValidateSeriesTags } from '~/interfaces/IArticle';
import { IValidateSeriesTags } from '..';

const validateSeriesTags = (set, _get) => async (
  data: IParamsValidateSeriesTags, onSuccess: (response: any) => void, onError: (error: any) => void,
) => {
  try {
    set((state: IValidateSeriesTags) => {
      state.isValidating = true;
    }, 'validateSeriesTags fetching');
    const response = await streamApi.validateSeriesTags(data);
    onSuccess?.(response);
    set((state: IValidateSeriesTags) => {
      state.isValidating = false;
    }, 'validateSeriesTags fetching success');
  } catch (error) {
    set((state: IValidateSeriesTags) => {
      state.isValidating = false;
    }, 'validateSeriesTags fetching error');
    onError?.(error);
  }
};

export default validateSeriesTags;

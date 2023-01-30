import streamApi from '~/api/StreamApi';
import { IParamsValidateSeriesTags } from '~/interfaces/IArticle';
import { ICreateArticleState } from '..';

const validateSeriesTags = (set, _get) => async (
  data: IParamsValidateSeriesTags, onSuccess: (response: any) => void, onError: (error: any) => void,
) => {
  try {
    set((state: ICreateArticleState) => {
      state.isValidating = true;
    }, 'validateSeriesTags fetching');
    const response = await streamApi.validateSeriesTagsOfArticle(data);
    onSuccess?.(response);
    set((state: ICreateArticleState) => {
      state.isValidating = false;
    }, 'validateSeriesTags fetching success');
  } catch (error) {
    set((state: ICreateArticleState) => {
      state.isValidating = false;
    }, 'validateSeriesTags fetching error');
    onError?.(error);
  }
};

export default validateSeriesTags;

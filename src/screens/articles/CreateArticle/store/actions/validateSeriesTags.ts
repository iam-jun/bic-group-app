import streamApi from '~/api/StreamApi';
import { IParamsValidateSeriesTags } from '~/interfaces/IArticle';

const validateSeriesTags = (_set, _get) => async (
  data: IParamsValidateSeriesTags, onSuccess: (response: any) => void, onError: (error: any) => void,
) => {
  try {
    const response = await streamApi.validateSeriesTagsOfArticle(data);
    onSuccess?.(response);
  } catch (error) {
    onError?.(error);
  }
};

export default validateSeriesTags;

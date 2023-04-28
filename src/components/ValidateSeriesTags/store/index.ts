import { IParamsValidateSeriesTags } from '~/interfaces/IArticle';
import { PostType } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import handleSeriesTagsError from './actions/handleSeriesTagsError';
import validateSeriesTags from './actions/validateSeriesTags';

export type HandleSeriesTagsErrorParams = {
  postType: PostType.ARTICLE | PostType.POST;
  error: any;
  onNext?: () => void;
  titleAlert?: string;
};

export interface IValidateSeriesTags extends IBaseState {
  isValidating: boolean;
  actions: {
    validateSeriesTags: (
      data: IParamsValidateSeriesTags,
      onSuccess: (response) => void,
      onError: (error) => void
    ) => void;
    handleSeriesTagsError: (params: HandleSeriesTagsErrorParams) => void;
  };
}

const initialState: InitStateType<IValidateSeriesTags> = {
  isValidating: false,
};

const useValidateSeriesTags = (set, get): IValidateSeriesTags => ({
  ...initialState,
  actions: {
    validateSeriesTags: validateSeriesTags(set, get),
    handleSeriesTagsError: handleSeriesTagsError(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useValidateSeriesTagsStore = createStore<IValidateSeriesTags>(
  useValidateSeriesTags,
);

export default useValidateSeriesTagsStore;

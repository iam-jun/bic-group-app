import streamApi from '~/api/StreamApi';
import { IPayloadGetPublishContents } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IPublishedContentFilter, IPublishState } from '../index';
import { getParamsContentFeed } from '~/screens/Home/store/helper';
import useYourContentStore from '~/screens/YourContent/store';
import showToastError from '~/store/helper/showToastError';
import { IParamGetFeed } from '~/interfaces/IHome';

const getPublishContent = (set, get) => async (payload: IPayloadGetPublishContents) => {
  const { isRefresh } = payload;
  const { publishContents }: IPublishState = get();
  const { activePublishTab } = useYourContentStore.getState();
  const currentContents: IPublishedContentFilter = publishContents[activePublishTab];

  if (currentContents.loading) return;

  set((state: IPublishState) => {
    if (isRefresh) {
      state.publishContents[activePublishTab] = {
        ...state.publishContents[activePublishTab],
        refreshing: true,
      };
    } else {
      state.publishContents[activePublishTab] = {
        ...state.publishContents[activePublishTab],
        loading: true,
      };
    }
  }, 'action getPublishContent');

  try {
    const endCursor = isRefresh ? null : currentContents.endCursor;
    const params: IParamGetFeed = {
      after: endCursor,
      isImportant: false,
      isSaved: false,
      isMine: true,
      type: getParamsContentFeed(activePublishTab),
    };
    const response = await streamApi.getNewsfeed(params);

    const result = response?.list || [];
    usePostsStore.getState().actions.addToPosts({ data: result });

    const newIds = result.map((item) => item.id);
    const currentIds = currentContents.ids || [];
    const ids = isRefresh ? [] : currentIds;
    set((state: IPublishState) => {
      state.publishContents[activePublishTab] = {
        ...state.publishContents[activePublishTab],
        loading: false,
        refreshing: false,
        ids: ids.concat(newIds),
        hasNextPage: response?.meta?.hasNextPage || false,
        endCursor: response?.meta?.endCursor || null,
      };
    }, 'action getPublishContent Success');
  } catch (e) {
    set((state: IPublishState) => {
      state.publishContents[activePublishTab] = {
        ...state.publishContents[activePublishTab],
        loading: false,
        refreshing: false,
        hasNextPage: false,
        endCursor: null,
      };
    }, 'action getPublishContent Failed');
    console.error('\x1b[31m🐣️ action getPublishContent error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getPublishContent;

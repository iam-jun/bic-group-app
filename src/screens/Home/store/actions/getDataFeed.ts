import streamApi from '~/api/StreamApi';
import { IParamGetFeed } from '~/interfaces/IHome';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { getParamsAttributeFeed, getParamsContentFeed } from '../helper';
import IHomeState from '../Interface';

const getDataFeed = (set, get) => async (isRefresh?: boolean) => {
  const { contentFilter, attributeFilter } = get();
  set((state: IHomeState) => {
    state.feed[contentFilter][attributeFilter] = {
      ...state.feed[contentFilter][attributeFilter],
      isLoading: !isRefresh,
      refreshing: isRefresh,
    };
  });
  const currentState: IHomeState = get();
  const currentList = currentState.feed[contentFilter][attributeFilter].data;
  const offset = isRefresh ? 0 : currentList.length || 0;
  const requestParams: IParamGetFeed = {
    offset,
    isImportant: getParamsAttributeFeed(attributeFilter),
    type: getParamsContentFeed(contentFilter),
  };

  await streamApi
    .getNewsfeed(requestParams)
    .then((response) => {
      const responseList = response?.list || [];
      usePostsStore
        .getState()
        .actions.addToPosts({ data: responseList } as IPayloadAddToAllPost);
      const lstIdPostResponse = responseList.map((item) => item.id);
      const newList = isRefresh
        ? lstIdPostResponse
        : currentList.concat(lstIdPostResponse);
      set((state: IHomeState) => {
        state.feed[contentFilter][attributeFilter] = {
          ...state.feed[contentFilter][attributeFilter],
          refreshing: false,
          isLoading: false,
          data: newList,
          canLoadMore: response?.meta?.hasNextPage || false,
        };
      }, 'getDataFeed');
    })
    .catch(() => {
      set((state: IHomeState) => {
        state.feed[contentFilter][attributeFilter] = {
          ...state.feed[contentFilter][attributeFilter],
          refreshing: false,
          isLoading: false,
          canLoadMore: false,
        };
      }, 'getTabData');
    });
};

export default getDataFeed;

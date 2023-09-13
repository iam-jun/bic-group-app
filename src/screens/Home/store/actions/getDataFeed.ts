import streamApi from '~/api/StreamApi';
import { AttributeFeed } from '~/interfaces/IFeed';
import { IParamGetFeed } from '~/interfaces/IHome';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import {
  getParamsContentFeed, isFilterWithThisAttributeFeed,
} from '../helper';
import IHomeState, { IHomeFeed } from '../Interface';
import appConfig from '~/configs/appConfig';

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
  const { data: currentList, endCursor: currentEndCursor } = currentState.feed[contentFilter][attributeFilter];
  const endCursor = isRefresh ? null : currentEndCursor;
  const requestParams: IParamGetFeed = {
    after: endCursor,
    limit: appConfig.recordsPerPage,
    isImportant: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.IMPORTANT),
    isSaved: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.SAVED),
    // isMine: isFilterWithThisAttributeFeed(attributeFilter, AttributeFeed.MINE),
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
          hasNextPage: response?.meta?.hasNextPage || false,
          endCursor: response?.meta?.endCursor || null,
        } as IHomeFeed;
      }, 'getDataFeed');
    })
    .catch(() => {
      set((state: IHomeState) => {
        state.feed[contentFilter][attributeFilter] = {
          ...state.feed[contentFilter][attributeFilter],
          refreshing: false,
          isLoading: false,
          hasNextPage: false,
          endCursor: null,
        } as IHomeFeed;
      }, 'getTabData');
    });
};

export default getDataFeed;

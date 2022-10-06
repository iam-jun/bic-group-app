import streamApi from '~/api/StreamApi';
import { IParamGetFeed } from '~/interfaces/IHome';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import IHomeState, { HOME_TAB_TYPE } from '../Interface';
import usePostsStore from '~/store/entities/posts';

const getTabData = (set, get) => (tabId: keyof typeof HOME_TAB_TYPE, isRefresh?: boolean) => {
  const statePath = tabId === HOME_TAB_TYPE.NEWSFEED ? 'tabNewsfeed' : 'tabImportant';
  set(
    (state: IHomeState) => {
      state[statePath] = { ...state[statePath], refreshing: true };
    },
  );
  const currentState: IHomeState = get();
  const currentList = currentState[statePath].data;
  const offset = isRefresh ? 0 : currentList.length || 0;
  const requestParams: IParamGetFeed = { offset };
  if (tabId === HOME_TAB_TYPE.IMPORTANT) {
    requestParams.isImportant = true;
  }
  streamApi.getNewsfeed(requestParams)
    .then((response) => {
      const responseList = response?.list || [];
      usePostsStore.getState().actions.addToPosts({ data: responseList } as IPayloadAddToAllPost);
      const newList = isRefresh ? responseList : currentList.concat(responseList);
      set(
        (state: IHomeState) => {
          state[statePath] = {
            ...state[statePath],
            refreshing: false,
            data: newList,
            canLoadMore: response?.meta?.hasNextPage || false,
          };
        },
        'getTabData',
      );
    })
    .catch(() => {
      set(
        (state: IHomeState) => {
          state[statePath] = {
            ...state[statePath],
            refreshing: false,
            canLoadMore: false,
          };
        },
        'getTabData',
      );
    });
};

export default getTabData;

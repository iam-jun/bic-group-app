import streamApi from '~/api/StreamApi';
import { IPost, IPayloadGetPublishContents } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IPublishState } from '../index';
import { getParamsContentFeed } from '~/screens/Home/store/helper';
import useYourContentStore from '~/screens/YourContent/store';
import { IBaseListState } from '~/store/interfaces/IBaseState';
import showToastError from '~/store/helper/showToastError';

const getPublishContent = (set, get) => async (payload: IPayloadGetPublishContents) => {
    const { isRefresh } = payload;
    const { publishContents }: IPublishState = get();
    const { activePublishTab } = useYourContentStore.getState();
    const currentContents: IBaseListState<IPost> = publishContents[activePublishTab];

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
        const offset = isRefresh ? 0 : currentContents.ids?.length || 0;
        const params = {
            offset,
            isImportant: false,
            isSaved: false,
            isMine: true,
            type: getParamsContentFeed(activePublishTab)
        };
        const response = await streamApi.getNewsfeed(params);

        const result = response?.list || [];
        usePostsStore.getState().actions.addToPosts({ data: result, handleComment: true });

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
            };
        }, 'action getPublishContent Success');
    } catch (e) {
        set((state: IPublishState) => {
            state.publishContents[activePublishTab] = {
                ...state.publishContents[activePublishTab],
                loading: false,
                refreshing: false,
                hasNextPage: false,
            };
        }, 'action getPublishContent Failed');
        console.error('\x1b[31m🐣️ action getPublishContent error: ', e, '\x1b[0m');
        showToastError(e);
    }
};

export default getPublishContent;

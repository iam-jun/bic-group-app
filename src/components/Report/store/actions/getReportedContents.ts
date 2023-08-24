import streamApi from '~/api/StreamApi';
import appConfig from '~/configs/appConfig';
import { IPost } from '~/interfaces/IPost';
import { IParamGetReportContent } from '~/interfaces/IReport';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { IReportContentState } from '../index';

const getReportedContents = (set, get) => async (isRefresh: boolean) => {
  const { reportedContents, actions } : IReportContentState = get();
  const { ids, loading, hasNextPage } = reportedContents;
  try {
    if (loading || (!isRefresh && !hasNextPage)) return;

    set((state: IReportContentState) => {
      if (isRefresh) {
        state.reportedContents.refreshing = true;
      } else {
        state.reportedContents.loading = true;
      }
    }, 'getReportedContents');

    const params: IParamGetReportContent = {
      order: 'DESC',
      offset: isRefresh ? 0 : ids.length,
      limit: appConfig.recordsPerPage,
    };

    const response = await streamApi.getReportContent(params);

    if (!response?.data?.list) {
      set((state: IReportContentState) => {
        state.reportedContents.loading = false;
        state.reportedContents.refreshing = false;
      }, 'getReportedContentsFail');
      return;
    }

    const dataList = response.data.list;
    usePostsStore.getState().actions.addToPosts({ data: dataList });
    actions.addToReportDetailsPost(dataList);

    const dataIds = dataList.map((item: IPost) => item.id);
    const newUpdatedDataIds = isRefresh ? dataIds : [...ids, ...dataIds];

    set((state: IReportContentState) => {
      state.reportedContents.loading = false;
      state.reportedContents.refreshing = false;
      state.reportedContents.ids = newUpdatedDataIds;
      state.reportedContents.hasNextPage = !!response?.data?.meta?.hasNextPage;
    }, 'getReportedContentsSuccess');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getReportedContents error: ', error, '\x1b[0m');

    set((state: IReportContentState) => {
      state.reportedContents.loading = false;
      state.reportedContents.refreshing = false;
    }, 'getReportedContentsError');

    showToastError(error);
  }
};

export default getReportedContents;

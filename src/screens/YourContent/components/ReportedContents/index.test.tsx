import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import ReportedContents from './index';
import { reportedArticleDetail, reportedPostDetail } from '~/test/mock_data/reportedContents';
import useReportContentStore, { IReportContentState } from '~/components/Report/store';
import usePostsStore from '~/store/entities/posts';

describe('ReportedContents component', () => {
  const mockData = [reportedPostDetail.id, reportedArticleDetail.id];
  it('should render empty screen if loading = false', () => {
    useReportContentStore.setState((state: IReportContentState) => {
      state.reportedContents.ids = [];
      state.reportedContents.refreshing = false;
      return state;
    });

    const onScroll = jest.fn();

    const wrapper = renderWithRedux(
      <ReportedContents
        onScroll={onScroll}
      />,
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should render full list item reported', () => {
    useReportContentStore.setState((state: IReportContentState) => {
      state.reportedContents.ids = mockData;
      state.reportedContents.refreshing = false;
      state.reportedContents.loading = true;
      return state;
    });

    const { actions } = usePostsStore.getState();
    actions.addToPosts({ data: [reportedPostDetail, reportedArticleDetail] as any, handleComment: true });

    const onScroll = jest.fn();

    const wrapper = renderWithRedux(
      <ReportedContents
        onScroll={onScroll}
      />,
    );
    const reportedItemsComp = wrapper.queryAllByTestId('reported_contents.item');
    expect(reportedItemsComp).toBeDefined();
    expect(reportedItemsComp.length).toEqual(mockData.length);
  });
});

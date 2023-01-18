import React from 'react';
import { mockArticle } from '~/test/mock_data/article';
import useScheduleArticlesStore, { IScheduleArticlesState } from './store';
import { IPost } from '~/interfaces/IPost';
import { renderWithRedux } from '~/test/testUtils';
import ScheduledArticles from '.';

describe('ScheduledArticles component', () => {
  it('render correctly', () => {
    useScheduleArticlesStore.setState((state: IScheduleArticlesState) => {
      state.scheduleArticles.data = [mockArticle] as IPost[];
      return state;
    });
    const rendered = renderWithRedux(<ScheduledArticles />);
    const contentView = rendered.getByTestId('schedule_article.content');

    expect(rendered.toJSON()).toMatchSnapshot();
    expect(contentView).toBeDefined();
  });

  it('should render empty view when schedule aritcles are empty end cant load more', () => {
    useScheduleArticlesStore.setState((state: IScheduleArticlesState) => {
      state.scheduleArticles.data = [] as IPost[];
      state.scheduleArticles.hasNextPage = false;
      return state;
    });

    const rendered = renderWithRedux(<ScheduledArticles />);

    const emptyView = rendered.getByTestId('schedule_article.empty_view');
    expect(emptyView).toBeDefined();
  });
});

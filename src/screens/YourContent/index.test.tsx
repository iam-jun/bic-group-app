import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import YourContent from './index';

describe('Your Content screen', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <YourContent />,
    );
    const tabScheduleArticle = wrapper.queryByTestId('tab-button-your_content:title_schedule_article-selected');
    expect(tabScheduleArticle).toBeDefined();
    fireEvent.press(tabScheduleArticle);

    const tabReportedContent = wrapper.queryByTestId('tab-button-your_content:title_report_content-notselected');
    expect(tabReportedContent).toBeDefined();
    fireEvent.press(tabReportedContent);
  });
});

import React from 'react';
import { Dimensions } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import YourContent from './index';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

describe('Your Content screen', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <YourContent />,
    );

    const tabDraft = wrapper.queryByTestId('tab-button-your_content:title_draft-selected');
    expect(tabDraft).toBeDefined();
    fireEvent.press(tabDraft);

    const tabScheduleArticle = wrapper.queryByTestId('tab-button-your_content:title_schedule_article-notselected');
    expect(tabScheduleArticle).toBeDefined();
    fireEvent.press(tabScheduleArticle);

    const tabReportedContent = wrapper.queryByTestId('tab-button-your_content:title_report_content-notselected');
    expect(tabReportedContent).toBeDefined();
    fireEvent.press(tabReportedContent);
  });

  it('should show header filter', () => {
    const wrapper = renderWithRedux(
      <YourContent />,
    );

    const flatList = wrapper.getByTestId('draft_post.list');
    const headerFilter = wrapper.getByTestId('your_content.header_filter');

    expect(flatList).toBeDefined();
    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentSize: { height: 600, width: 400 },
        contentOffset: { y: 150, x: 0 },
        layoutMeasurement: { height, width },
      },
    });

    expect(headerFilter.props.style.transform[0].translateY).toEqual(0);
  });
});

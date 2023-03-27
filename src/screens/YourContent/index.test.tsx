import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import YourContent from './index';
import { Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

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

  it('should call hide() when scroll down', () => {
    const wrapper = renderWithRedux(
      <YourContent />,
    );

    

    const flatList = wrapper.getByTestId('draft_post.list');
    expect(flatList).toBeDefined();

    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentSize: { height: 600, width: 400 },
        contentOffset: { y: 150, x: 0 },
        layoutMeasurement: { height, width },
      }
    });

  });
});

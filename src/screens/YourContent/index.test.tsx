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

    const tabDraft = wrapper.queryByTestId('tab-button-your_content:title_draft-notselected');
    expect(tabDraft).toBeDefined();
    fireEvent.press(tabDraft);

    const tabScheduleArticle = wrapper.queryByTestId('tab-button-your_content:title_scheduled-selected');
    expect(tabScheduleArticle).toBeDefined();

    const tabReportedContent = wrapper.queryByTestId('tab-button-your_content:title_report_content-notselected');
    expect(tabReportedContent).toBeDefined();
    fireEvent.press(tabReportedContent);
  });

  it('should render Draft tab', () => {
    const props = {
      route: {
        params: {
          initTab: 0,
        },
      },
    };

    const wrapper = renderWithRedux(
      <YourContent {...props} />,
    );

    const tabDraftPost = wrapper.queryByTestId('tab-button-post:draft:text_posts-selected');
    expect(tabDraftPost).toBeDefined();
    fireEvent.press(tabDraftPost);

    const tabDraftArticle = wrapper.queryByTestId('tab-button-your_content:title_scheduled-notselected');
    expect(tabDraftArticle).toBeDefined();
    fireEvent.press(tabDraftArticle);
  });

  it('should render Publish tab', () => {
    const props = {
      route: {
        params: {
          initTab: 2,
        },
      },
    };

    const wrapper = renderWithRedux(
      <YourContent {...props} />,
    );

    const tabPulishContents = wrapper.queryByTestId('tab-button-home:title_feed_content_all-selected');
    expect(tabPulishContents).toBeDefined();
    fireEvent.press(tabPulishContents);

    const tabDraftArticle = wrapper.queryByTestId('tab-button-your_content:title_scheduled-notselected');
    expect(tabDraftArticle).toBeDefined();
    fireEvent.press(tabDraftArticle);
  });

  it('should show header filter', () => {
    const wrapper = renderWithRedux(
      <YourContent />,
    );

    const flatList = wrapper.getByTestId('scheduled.content');
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

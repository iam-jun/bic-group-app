import React from 'react';
import { Dimensions } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import YourQuiz from './index';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

describe('Your Quiz screen', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <YourQuiz />,
    );

    const tabDraftQuiz = wrapper.queryByTestId(
      'tab-button-your_content:title_draft-selected',
    );
    expect(tabDraftQuiz).toBeDefined();

    const tabPublishedQuiz = wrapper.queryByTestId(
      'tab-button-your_content:title_published-notselected',
    );
    expect(tabPublishedQuiz).toBeDefined();
    fireEvent.press(tabPublishedQuiz);
  });

  it('should render sub tab', () => {
    const wrapper = renderWithRedux(
      <YourQuiz />,
    );

    const subTabContent = wrapper.queryByTestId(
      'tab-button-home:title_feed_content_all-selected',
    );
    expect(subTabContent).toBeDefined();
    fireEvent.press(subTabContent);

    const subTabPost = wrapper.queryByTestId(
      'tab-button-home:title_feed_content_posts-notselected',
    );
    expect(subTabPost).toBeDefined();

    const subTabArticle = wrapper.queryByTestId(
      'tab-button-home:title_feed_content_articles-notselected',
    );
    expect(subTabArticle).toBeDefined();
  });

  it('should show header filter', () => {
    const wrapper = renderWithRedux(
      <YourQuiz />,
    );

    const flatList = wrapper.getByTestId('quiz.list');
    const headerFilter = wrapper.getByTestId('your_quiz.header_filter');

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

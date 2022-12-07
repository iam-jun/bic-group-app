import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import FilterFeedButtonGroup from './FilterFeedButtonGroup';
import { ContentFeed, AttributeFeed } from '~/interfaces/IFeed';

describe('FilterFeedButtonGroup component', () => {
  it('renders FilterFeedButtonGroup correctly', () => {
    const onPressAttributeFilterTab = jest.fn();
    const onPressContentFilterTab = jest.fn();
    const rendered = renderWithRedux(
      <FilterFeedButtonGroup
        contentFilter={ContentFeed.ALL}
        attributeFilter={AttributeFeed.ALL}
        onPressAttributeFilterTab={onPressAttributeFilterTab}
        onPressContentFilterTab={onPressContentFilterTab}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import InvalidSeriesTagsContentModal from './InvalidSeriesTagsContentModal';

describe('InvalidSeriesTagsContentModal component', () => {
  it('should renders correctly', () => {
    const seriesNames = ['basic-1', 'basic-2'];
    const tagNames = ['noob', 'beginner'];

    const wrapper = renderWithRedux(<InvalidSeriesTagsContentModal
      seriesNames={seriesNames}
      tagNames={tagNames}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});

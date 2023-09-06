import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CirclePercentage from '.';

describe('CirclePercentage', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <CirclePercentage
        percent={50}
        radius={50}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with clockwise = false', () => {
    const wrapper = renderWithRedux(
      <CirclePercentage
        percent={60}
        radius={50}
        clockwise={false}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});

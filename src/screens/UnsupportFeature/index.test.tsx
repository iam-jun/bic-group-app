import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import UnsupportFeature from './index';

describe('UnsupportFeature component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<UnsupportFeature />);
    expect(wrapper).toMatchSnapshot();
  });
});

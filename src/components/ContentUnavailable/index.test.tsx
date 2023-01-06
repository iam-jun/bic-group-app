import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import ContentUnavailable from './index';

describe('ContentUnavailable component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<ContentUnavailable />);
    expect(wrapper).toMatchSnapshot();
  });
});

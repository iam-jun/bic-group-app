import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import InfoItem from './index';

describe('InfoItem component', () => {
  const props = { style: undefined, title: 'test', value: '' };

  it('should render props correctly', () => {
    const rendered = renderWithRedux(<InfoItem {...props} />);
    expect(rendered.toJSON()).toMatchSnapshot();

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('info_item');
    expect(containerComponent).toBeDefined();
  });
});

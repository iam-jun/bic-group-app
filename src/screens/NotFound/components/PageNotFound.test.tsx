import React from 'react';
import { render } from '~/test/testUtils';
import PageNotFound from './PageNotFound';

describe('PageNotFound screen', () => {
  it('should render correctly', () => {
    const props = {
      testID: 'test',
    };
    const rendered = render(<PageNotFound {...props} />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId(props.testID);
    expect(containerComponent).toBeDefined();
  });
});

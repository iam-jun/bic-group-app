import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import DeletedItem from '.';

afterEach(cleanup);

describe('DeletedItem component', () => {
  it('renders correctly', () => {
    const rendered = render(<DeletedItem />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly title', () => {
    const { getByTestId } = render(<DeletedItem title="title" />);
    const deleteComponent = getByTestId('series.label_deleted');
    expect(deleteComponent.props?.children).toBe('title');
  });

  it('renders correctly style', () => {
    const { getByTestId } = render(<DeletedItem style={{ backgroundColor: 'red' }} />);
    const deleteComponent = getByTestId('series.delete_item');
    expect(deleteComponent.props?.style[1]?.backgroundColor).toBe('red');
  });
});

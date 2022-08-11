import React from 'react';

import BannerImportant from './BannerImportant'
import {renderWithRedux} from '../../test/testUtils';

describe('BannerImportant component', () => {
  it('renders active banner correctly', () => {
    const rendered = renderWithRedux(
      <BannerImportant markedAsRead={false} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('renders inactive banner correctly', () => {
    const rendered = renderWithRedux(
      <BannerImportant markedAsRead={true} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })
})

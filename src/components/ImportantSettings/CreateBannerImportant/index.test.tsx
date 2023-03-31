import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CreateBannerImportant from './index';

describe('CreateBannerImportant component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <CreateBannerImportant
        type="article"
        expiresTime="2023-03-14T10:40:55.512Z"
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

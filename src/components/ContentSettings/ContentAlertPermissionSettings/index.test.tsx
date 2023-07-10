import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import ContentAlertPermissionSettings from './index';

describe('ContentAlertPermissionSettings', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <ContentAlertPermissionSettings
        audienceListNames="a community, b community"
      />,
    );

    expect(rendered).toMatchSnapshot();
  });
});

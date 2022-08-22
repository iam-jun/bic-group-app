import React from 'react';

import TabButton from './TabButton';
import { renderWithRedux } from '~/test/testUtils';

describe('TabButton', () => {
  it('renders selected button with size medium', () => {
    const rendered = renderWithRedux(
      <TabButton isSelected size="medium">Tab button</TabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders unselected button with size large', () => {
    const rendered = renderWithRedux(
      <TabButton isSelected={false} size="large">Tab button</TabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

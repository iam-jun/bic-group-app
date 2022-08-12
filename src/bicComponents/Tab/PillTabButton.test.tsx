import React from 'react';

import PillTabButton from './PillTabButton';
import { renderWithRedux } from '~/test/testUtils';

describe('PillTabButton', () => {
  it('renders selected button with type primary and size medium correctly', () => {
    const rendered = renderWithRedux(
      <PillTabButton isSelected type="primary" size="medium">
        Tab button
      </PillTabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('renders selected button with type secondary and size large correctly', () => {
    const rendered = renderWithRedux(
      <PillTabButton isSelected type="secondary" size="large">
        Tab button
      </PillTabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('renders selected button with type secondary and size small correctly', () => {
    const rendered = renderWithRedux(
      <PillTabButton isSelected type="neutral" size="small">
        Tab button
      </PillTabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('renders unselected button with size medium correctly', () => {
    const rendered = renderWithRedux(
      <PillTabButton isSelected={false} size="medium">
        Tab button
      </PillTabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })
})

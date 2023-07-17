import React from 'react';
import { render } from '~/test/testUtils';
import BadgeNew from './BadgeNew';

describe('BadgeNew component', () => {
  it('should render correctly with full props', () => {
    const rendered = render(
      <BadgeNew style={{ borderWidth: 2 }} />,
    );

    const { getByTestId } = rendered;
    const component = getByTestId('badge_new');
    expect(component).toBeDefined();

    expect(component.props?.style?.[1]).toEqual({ borderWidth: 2 });
  });
});

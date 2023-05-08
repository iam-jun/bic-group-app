import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import Image from '.';

describe('Image component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <Image
        source="https://img.com/1"
        width={60}
        style={{ height: 60 }}
        testID="image"
      />,
    );

    const img = rendered.getByTestId('image');
    expect(img).toBeDefined();
  });

  it('given no source should render by placeholder', () => {
    const rendered = renderWithRedux(
      <Image
        placeholderSource="https://img.com/1"
        style={{ height: 60, width: 60 }}
        testID="image"
      />,
    );

    const img = rendered.getByTestId('image');
    expect(img).toBeDefined();
  });
});

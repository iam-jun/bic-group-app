import React from 'react';
import { postFile } from '~/test/mock_data/pinContent';
import { renderWithRedux } from '~/test/testUtils';
import PinPostFile from './PinPostFile';

describe('PinPostFile component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <PinPostFile
        data={postFile.media.files as any}
      />,
    );
    const file = rendered.queryByTestId('pin_post_file.content');
    expect(file).toBeDefined();
  });

  it('should render null', () => {
    const rendered = renderWithRedux(
      <PinPostFile
        data={[] as any}
      />,
    );
    const file = rendered.queryByTestId('pin_post_file.content');
    expect(file).toBeNull();
  });
});

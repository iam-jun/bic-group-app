import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import PlaceHolderRemoveContent from '.';

describe('PlaceHolderRemoveContent component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <PlaceHolderRemoveContent
        label="common:text_article_reported"
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import { listArticle } from '../../../../test/mock_data/series';
import ListArticle from './ListArticle';

describe('ListArticle component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<ListArticle lstArticle={listArticle} />);
    expect(wrapper).toMatchSnapshot();
  });
});

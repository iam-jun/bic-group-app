import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CreateArticleSettings from './index';
import MockedNavigator from '~/test/MockedNavigator';
import { mockArticle } from '~/test/mock_data/article';

describe('CreateArticleSettings screen', () => {
  it('render correctly', () => {
    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleSettings
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

import React from 'react';

import {
  createTestStore,
  renderWithRedux,
} from '~/test/testUtils';
import ArticleWebview from '.';
import initialState from '~/storeRedux/initialState';
import * as useMounted from '~/hooks/mounted';

describe('ArticleWebview Component', () => {
  const state = { ...initialState };
  const onMessage = jest.fn();
  const initScript = { type: 'initDetail', payload: [] };

  it('renders correctly', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleWebview
        initScript={initScript}
        onMessage={onMessage}
      />, store,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render null', () => {
    jest.spyOn(useMounted, 'default').mockImplementation(() => (false));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleWebview
        initScript={initScript}
        onMessage={onMessage}
      />, store,
    );

    const webview = wrapper.queryByTestId('article_webview');

    expect(webview).toBeNull();
  });
});

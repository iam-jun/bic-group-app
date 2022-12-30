import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import CreateArticleSummary from '.';
import usePostsStore from '~/store/entities/posts';
import { mockArticle } from '~/test/mock_data/article';
import { IPost } from '~/interfaces/IPost';
import MockedNavigator from '~/test/MockedNavigator';
import useCreateArticleStore from '../../store';

describe('CreateArticleSummary screen', () => {
  it('should not enable button save if summary is empty', () => {
    const article = { ...mockArticle };
    article.summary = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleSummary
            route={{ params: { articleId: article.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getByTestId('button.text');
    expect(btnText).toBeDefined();
    expect(btnText.props?.children).toBe('Save');

    const btnNext = wrapper.getByTestId('button.content');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should enable button save if summary is changed', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleSummary
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    act(() => {
      useCreateArticleStore.getState().actions.setSummary('changed');
    });

    const btnNext = wrapper.getByTestId('button.content');

    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });
});

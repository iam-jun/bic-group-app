import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import EditArticleCategory from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import useCreateArticleStore from '../../store';

describe('CreateArticleCategory screen', () => {
  it('should not enable button save if category is empty', () => {
    const article = { ...mockArticle };
    article.categories = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditArticleCategory
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

  it('should enable button save if category is not empty & changed', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditArticleCategory
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    act(() => {
      useCreateArticleStore.getState().actions.setCategories([{ id: '1', name: 'a' }]);
    });

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Save');

    const btnNext = wrapper.getAllByTestId('button.content');
    expect(btnNext[0]).toBeDefined();
    expect(btnNext[0].props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });
});

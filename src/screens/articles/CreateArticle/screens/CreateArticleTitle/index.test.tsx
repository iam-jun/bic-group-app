import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import EditTitle from '.';
import usePostsStore from '~/store/entities/posts';
import { mockArticle } from '~/test/mock_data/article';
import { IPost } from '~/interfaces/IPost';
import MockedNavigator from '~/test/MockedNavigator';

describe('EditTitle screen', () => {
  it('should not enable button next if title is empty', () => {
    const article = { ...mockArticle };
    article.title = '';

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditTitle
            route={{ params: { articleId: article.id, isDraft: true } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getByTestId('button.text');
    expect(btnText).toBeDefined();
    expect(btnText.props?.children).toBe('Next');

    const btnNext = wrapper.getByTestId('button.content');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should enable button next if title is not empty', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditTitle
            route={{ params: { articleId: mockArticle.id, isDraft: true } }}
          />
        )}
      />,
    );

    const btnNext = wrapper.getByTestId('button.content');

    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });
});

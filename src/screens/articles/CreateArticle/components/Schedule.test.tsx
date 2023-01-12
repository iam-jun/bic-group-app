import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import Schedule from './Schedule';

describe('Schedule', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Schedule
            articleId={article.id}
          />
        )}
      />,
    );

    const btn = wrapper.getByTestId('button.icon');
    expect(btn).toBeDefined();
    expect(btn.props?.tintColor).toBe('#7335C0');

    expect(wrapper).toMatchSnapshot();
  });
});

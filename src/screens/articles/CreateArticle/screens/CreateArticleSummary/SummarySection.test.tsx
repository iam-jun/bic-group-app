import React from 'react';

import { act, renderHook, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import SummarySection from './SummarySection';
import useCreateArticle from '../../hooks/useCreateArticle';

describe('SummarySection', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });
    renderHook(() => useCreateArticle({ articleId: article.id }));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SummarySection
            onPress={() => {
              // do something
            }}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});

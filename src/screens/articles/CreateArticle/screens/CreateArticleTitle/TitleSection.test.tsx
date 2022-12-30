import React from 'react';

import { act, renderHook, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import TitleSection from './TitleSection';
import useCreateArticle from '../../hooks/useCreateArticle';

describe('TitleSection', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });
    renderHook(() => useCreateArticle({ articleId: article.id }));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TitleSection
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

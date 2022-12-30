import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import AudienceSection from './AudienceSection';

describe('AudienceSection', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <AudienceSection
            articleId={article.id}
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

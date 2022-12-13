import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import EditArticleCategory from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import { IEditArticleAudience, IEditArticleData } from '~/interfaces/IArticle';
import { getAudienceIdsFromAudienceObject } from '../../helper';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import useCreateArticleStore from '../../store';

describe('EditCategory screen', () => {
  it('should not enable button next if topic is empty', () => {
    const article = { ...mockArticle };
    article.categories = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id, title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia, series,
      };
      useCreateArticleStore.getState().actions.setData(data);
      useCreateArticleStore.getState().actions.setIsPublishing(true);
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
    expect(btnText.props?.children).toBe('Next');

    const btnNext = wrapper.getByTestId('button.content');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should enable button next if topic is not empty', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series,
      } = mockArticle;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id, title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia, series,
      };
      useCreateArticleStore.getState().actions.setData(data);
      useCreateArticleStore.getState().actions.setIsPublishing(true);
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

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Next');

    const btnNext = wrapper.getAllByTestId('button.content');
    expect(btnNext[0]).toBeDefined();
    expect(btnNext[0].props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });
});

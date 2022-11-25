import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import EditArticleContent from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import useEditArticleStore from '../store';
import { IEditArticleAudience, IEditArticleData } from '~/interfaces/IArticle';
import { getAudienceIdsFromAudienceObject } from '../helper';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';

describe('EditArticleContent screen', () => {
  it('should not enable button publish if content is empty', () => {
    const article = { ...mockArticle };
    article.content = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id, title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia, series,
      };
      useEditArticleStore.getState().actions.setData(data);
      useEditArticleStore.getState().actions.setIsPublishing(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditArticleContent
            route={{ params: { articleId: article.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getByTestId('button.text');
    expect(btnText).toBeDefined();
    expect(btnText.props?.children).toBe('Publish');

    const btnNext = wrapper.getByTestId('button.content');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should enable button publish if content is not empty', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series,
      } = mockArticle;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id, title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia, series,
      };
      useEditArticleStore.getState().actions.setData(data);
      useEditArticleStore.getState().actions.setIsPublishing(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditArticleContent
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Publish');

    const btnNext = wrapper.getAllByTestId('button.content');
    expect(btnNext[0]).toBeDefined();
    expect(btnNext[0].props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });
});

import React from 'react';

import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import CreateArticleTags from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import { getAudienceIdsFromAudienceObject } from '../../helper';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import useCreateArticleStore from '../../store';
import { IEditArticleAudience, IEditArticleData } from '~/interfaces/IArticle';
import * as navigationHook from '~/hooks/navigation';
import { mockGetTagsInArticle } from '~/test/mock_data/tags';
import streamApi from '~/api/StreamApi';

describe('CreateArticleTags screen', () => {
  it('should not enable button Save if audience is empty', () => {
    const article = { ...mockArticle };
    article.audience = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series, tags,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id,
        title,
        content: content || '',
        audience: audienceIds,
        mentions,
        summary,
        categories,
        coverMedia,
        series,
        tags,
      };
      useCreateArticleStore.getState().actions.setData(data);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleTags
            route={{ params: { articleId: article.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getByTestId('button.text');
    expect(btnText).toBeDefined();
    expect(btnText.props?.children).toBe('Save');

    const btnSave = wrapper.getByTestId('header.button');
    expect(btnSave).toBeDefined();
    expect(btnSave.props?.accessibilityState?.disabled).toBe(true);
  });

  it('should enable button next if audience is not empty', () => {
    const article = { ...mockArticle };
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series, tags,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id,
        title,
        content: content || '',
        audience: audienceIds,
        mentions,
        summary,
        categories,
        coverMedia,
        series,
        tags,
      };
      useCreateArticleStore.getState().actions.setData(data);
      useCreateArticleStore.getState().actions.setIsPublishing(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleTags
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Next');

    const btnNext = wrapper.getByTestId('header.button');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.accessibilityState?.disabled).toBe(false);
  });

  it('should show list tags when tags is not empty', () => {
    const response = {
      code: 200,
      data: {
        list: mockGetTagsInArticle,
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const article = { ...mockArticle };
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series, tags,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id,
        title,
        content: content || '',
        audience: audienceIds,
        mentions,
        summary,
        categories,
        coverMedia,
        series,
        tags,
      };
      useCreateArticleStore.getState().actions.setData(data);
      useCreateArticleStore.getState().actions.setIsPublishing(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleTags
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Next');

    const btnNext = wrapper.getByTestId('header.button');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.accessibilityState?.disabled).toBe(false);

    expect(spyApiGetTagsByAudiences).toBeCalled();

    const titleInfoSelectingList = wrapper.queryByTestId('aritcles.slecting_list_info.info_title');
    expect(titleInfoSelectingList).toBeDefined();
  });

  it('should goBack success when isPublishing = true', () => {
    const goBack = jest.fn();
    const rootNavigation = { goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const article = { ...mockArticle };
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      const {
        id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series, tags,
      } = article;
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
      const data: IEditArticleData = {
        id,
        title,
        content: content || '',
        audience: audienceIds,
        mentions,
        summary,
        categories,
        coverMedia,
        series,
        tags,
      };
      useCreateArticleStore.getState().actions.setData(data);
      useCreateArticleStore.getState().actions.setIsPublishing(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleTags
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    const btnBack = wrapper.getByTestId('header.back');
    expect(btnBack).toBeDefined();
    fireEvent.press(btnBack);

    expect(goBack).toBeCalled();
  });
});

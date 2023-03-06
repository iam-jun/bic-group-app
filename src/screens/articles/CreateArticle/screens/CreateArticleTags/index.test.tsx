import React from 'react';

import { act, renderWithRedux, waitFor } from '~/test/testUtils';
import CreateArticleTags from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import { mockGetTagsInArticle } from '~/test/mock_data/tags';
import streamApi from '~/api/StreamApi';
import useCreateArticleStore from '../../store';
import useSelectTagsStore from '~/components/SelectTags/store';

describe('CreateArticleTags screen', () => {
  it('should not enable button Save if tags is empty', () => {
    const article = { ...mockArticle };
    article.tags = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
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

  it('should enable button save if tag is not empty & changed', () => {
    const article = { ...mockArticle };
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
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

    act(() => {
      useCreateArticleStore.getState().actions.setTags([{ id: '1', name: 'a' }]);
    });

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Save');

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

    expect(spyApiGetTagsByAudiences).toBeCalled();

    const titleInfoSelectingList = wrapper.queryByTestId('aritcles.slecting_list_info.info_title');
    expect(titleInfoSelectingList).toBeDefined();
  });

  it('should not fetch tag list if audience group is empty', async () => {
    const article = { ...mockArticle };
    article.audience.groups = [];

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreateArticleTags
            route={{ params: { articleId: mockArticle.id } }}
          />
        )}
      />,
    );

    await waitFor(() => {
      const loadingTags = useSelectTagsStore.getState().listTag.loading;
      expect(loadingTags).toBeFalsy();
    });
  });
});

import React from 'react';

import {
  act, fireEvent, renderWithRedux,
} from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost, PostStatus } from '~/interfaces/IPost';
import Schedule from './Schedule';
import streamApi from '~/api/StreamApi';
import useValidateSeriesTags from '~/components/ValidateSeriesTags/store';

describe('Schedule', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

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

    expect(wrapper).toMatchSnapshot();
  });

  it('should validate series vs tags', async () => {
    const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
      () => Promise.resolve() as any,
    );

    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

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

    const btn = wrapper.getByTestId('button.content');

    act(() => {
      fireEvent.press(btn);
    });

    expect(useValidateSeriesTags.getState().isValidating).toBe(true);
    expect(spyApiValidateSeriesTags).toBeCalled();
  });

  it('validate series vs tags fail', async () => {
    const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
      () => Promise.reject() as any,
    );

    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

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

    const btn = wrapper.getByTestId('button.content');

    act(() => {
      fireEvent.press(btn);
    });

    expect(spyApiValidateSeriesTags).toBeCalled();
  });
});

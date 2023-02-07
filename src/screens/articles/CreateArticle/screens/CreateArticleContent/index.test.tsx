import React from 'react';

import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import EditArticleContent from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import useCreateArticleStore from '../../store';
import Header from '~/beinComponents/Header';

describe('CreateArticleContent screen', () => {
  it('should not enable button save if content is empty', () => {
    const article = { ...mockArticle };
    article.content = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
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
    expect(btnText.props?.children).toBe('Save');

    const btnNext = wrapper.getByTestId('button.content');
    expect(btnNext).toBeDefined();
    expect(btnNext.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should trigger onInitializeEnd', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
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

    const webview = wrapper.getByTestId('webview');

    fireEvent(webview, 'message', {
      nativeEvent: { data: '{"type":"onInitializeEnd"}' },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should enable button publish if content is not empty & changed', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
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

    act(() => {
      useCreateArticleStore.getState().actions.setContent('[{"type":"p","children":[{"text":"test"}]}]');
    });

    const webview = wrapper.getByTestId('webview');

    fireEvent(webview, 'message', {
      nativeEvent: { data: '{"type":"onInitializeEnd"}' },
    });

    const btnText = wrapper.getAllByTestId('button.text');
    expect(btnText[0]).toBeDefined();
    expect(btnText[0].props?.children).toBe('Save');

    const btnNext = wrapper.getAllByTestId('button.content');
    expect(btnNext[0]).toBeDefined();
    expect(btnNext[0].props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });

  it('should render correctly', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
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

    expect(wrapper).toMatchSnapshot();
  });

  it('should clickable on save button', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
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

    act(() => {
      useCreateArticleStore.getState().actions.setContent('[{"type":"p","children":[{"text":"test"}]}]');
    });

    const webview = wrapper.getByTestId('webview');

    fireEvent(webview, 'message', {
      nativeEvent: { data: '{"type":"onInitializeEnd"}' },
    });

    const onPressButtonFake = jest.spyOn(Header.prototype, '_onPressButton');

    const btnSave = wrapper.getByTestId('header.button');
    fireEvent.press(btnSave);
    expect(onPressButtonFake).toHaveBeenCalled();

    onPressButtonFake.mockClear();
  });
});

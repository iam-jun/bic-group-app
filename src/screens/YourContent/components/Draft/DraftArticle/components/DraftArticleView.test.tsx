import React from 'react';
import { act } from '@testing-library/react-hooks';
import { mockArticle } from '~/test/mock_data/article';
import { IPost } from '~/interfaces/IPost';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import DraftArticleView from './DraftArticleView';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useModalStore from '~/store/modal';
import useDraftArticleStore from '../store';

describe('DraftArticle component', () => {
  it('render correctly', () => {
    const rendered = renderWithRedux(
      <DraftArticleView
        data={mockArticle as IPost}
      />,
    );

    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should navigate to CreateArticle when press button edit', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(
      <DraftArticleView
        data={mockArticle as IPost}
      />,
    );

    const editBtn = rendered.getByTestId('draft_footer.edit');

    expect(editBtn).toBeDefined();
    fireEvent.press(editBtn);
    expect(navigate).toBeCalledWith(articleStack.createArticle, { articleId: mockArticle.id, isFromDraftScreen: true });
  });

  it('should show alert when press button delete', () => {
    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showAlert } as any;
      return state;
    });

    const rendered = renderWithRedux(
      <DraftArticleView
        data={mockArticle as IPost}
      />,
    );

    const deleteBtn = rendered.getByTestId('draft_footer.delete');

    expect(deleteBtn).toBeDefined();
    fireEvent.press(deleteBtn);
    act(() => {
      jest.runAllTimers();
    });
    expect(showAlert).toBeCalled();
  });

  it('should call publishDraftArticle when press button publish', () => {
    const publishDraftArticle = jest.fn();
    const actions = { publishDraftArticle };
    jest.spyOn(useDraftArticleStore, 'getState').mockImplementation(() => ({ actions } as any));

    const rendered = renderWithRedux(
      <DraftArticleView
        data={mockArticle as IPost}
      />,
    );

    const publishBtn = rendered.getByTestId('draft_footer.publish');

    expect(publishBtn).toBeDefined();
    fireEvent.press(publishBtn);
    expect(publishDraftArticle).toBeCalled();
  });

  it('should not call publishDraftArticle when has not id', () => {
    const publishDraftArticle = jest.fn();
    const actions = { publishDraftArticle };
    jest.spyOn(useDraftArticleStore, 'getState').mockImplementation(() => ({ actions } as any));

    const rendered = renderWithRedux(
      <DraftArticleView
        data={{} as IPost}
      />,
    );

    const publishBtn = rendered.getByTestId('draft_footer.publish');

    expect(publishBtn).toBeDefined();
    fireEvent.press(publishBtn);
    expect(publishDraftArticle).not.toBeCalled();
  });
});

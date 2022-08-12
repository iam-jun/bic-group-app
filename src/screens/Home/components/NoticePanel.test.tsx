import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';
import i18next from 'i18next';

import NoticePanel from './NoticePanel';
import { createTestStore, renderWithRedux } from '../../../test/testUtils';
import initialState from '../../../store/initialState';
import {
  LIST_POST_CONTAINING_VIDEO_PROCESS_1,
  LIST_POST_CONTAINING_VIDEO_PROCESS_2,
} from '../../../test/mock_data/draftPosts';
import postActions from '../../Post/redux/actions';

afterEach(cleanup);

describe('NoticePanel component', () => {
  it('renders correctly', () => {
    const state = { ...initialState };
    state.post.allPostContainingVideoInProgress = {
      total: 1,
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
    };
    const store = createTestStore(state) as any;
    const rendered = renderWithRedux(<NoticePanel />, store).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly when a total of list posts containing video in progress is greater than 1', () => {
    const state = { ...initialState };
    state.post.allPostContainingVideoInProgress = {
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_2.length,
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_2,
    };
    const store = createTestStore(state) as any;
    const rendered = renderWithRedux(<NoticePanel />, store);

    const titleComponent = rendered.getByTestId('notice_panel.title');
    expect(titleComponent).toBeDefined();
    expect(titleComponent.props?.children).toBe(
      i18next
        .t('home:notice_post_video_uploading:title')
        .replace(
          '(count)',
          `(${state.post.allPostContainingVideoInProgress.total})`,
        ),
    );
  });

  it('should render null when click close button', () => {
    const spy = jest.spyOn(postActions, 'setAllPostContainingVideoInProgress');

    const state = { ...initialState };
    state.post.allPostContainingVideoInProgress = {
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_2.length,
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_2,
    };
    const store = createTestStore(state) as any;
    const rendered = renderWithRedux(<NoticePanel />, store);

    const buttonCloseComponent = rendered.getByTestId(
      'notice_panel.button_close',
    );
    expect(buttonCloseComponent).toBeDefined();
    fireEvent.press(buttonCloseComponent);
    expect(spy).toBeCalled();

    const titleComponent = rendered.queryByTestId('notice_panel.title');
    expect(titleComponent).toBeNull();
  });
});

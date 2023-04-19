import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import VideoProcessingNotice from '.';
import usePostsInProgressStore from './store';

describe('VideoProcessingNotice component', () => {
  it('renders correctly', () => {
    const setTotal = jest.fn();
    usePostsInProgressStore.setState((state) => {
      state.actions.setTotal = setTotal;
      state.total = 1;
      return state;
    });

    const rendered = render(<VideoProcessingNotice />);
    const { getByTestId } = rendered;
    const btnClose = getByTestId('notice_panel.button_close');
    expect(btnClose).toBeDefined();
    fireEvent.press(btnClose);
    expect(setTotal).toBeCalled();
  });
});

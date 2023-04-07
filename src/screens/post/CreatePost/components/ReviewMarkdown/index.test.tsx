import { act } from '@testing-library/react-hooks';
import * as React from 'react';

import { fireEvent, renderHook, renderWithRedux } from '~/test/testUtils';
import useCreatePostStore from '../../store';
import useCommonController from '~/screens/store';
import ReviewMarkdown from '.';

describe('ReviewMarkdown component', () => {
  it('should render correctly', () => {
    const onPressDone = jest.fn();

    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));
    const { result: resultCommonController } = renderHook(() => useCommonController((state) => state.actions));

    act(() => {
      resultCommonController.current.setMyProfile({
        fullname: 'sonls',
        avatar: 'https://avatar.com/img',
      } as any);
      result.current.updateCreatePost({
        content: 'abc',
        chosenAudiences: [
          {
            name: 'aaa',
          },
          {
            name: 'bbb',
          },
        ],
      });
    });

    const wrapper = renderWithRedux(<ReviewMarkdown onPressDone={onPressDone} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should pressable on button done', () => {
    const onPressDone = jest.fn();

    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));
    const { result: resultCommonController } = renderHook(() => useCommonController((state) => state.actions));

    act(() => {
      resultCommonController.current.setMyProfile({
        fullname: 'sonls',
        avatar: 'https://avatar.com/img',
      } as any);
      result.current.updateCreatePost({
        content: 'abc',
        chosenAudiences: [
          {
            name: 'aaa',
          },
          {
            name: 'bbb',
          },
        ],
      });
    });

    const wrapper = renderWithRedux(<ReviewMarkdown onPressDone={onPressDone} />);

    const btnDone = wrapper.getByTestId('header.button');

    fireEvent.press(btnDone);
    expect(onPressDone).toBeCalled();
  });
});

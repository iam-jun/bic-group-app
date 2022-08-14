import React from 'react';

import { StyleSheet } from 'react-native';
import { renderWithRedux } from '~/test/testUtils';
import ButtonMarkAsRead from '~/screens/post/components/ButtonMarkAsRead';

describe('ButtonMarkAsRead', () => {
  it('renders correctly with prop style', async () => {
    const wrapper = renderWithRedux(
      <ButtonMarkAsRead
        postId={1}
        markedReadPost={false}
        isActor={false}
        isImportant
        expireTime="2032-05-04T08:30:00.000Z"
        style={{ backgroundColor: 'tomato' }}
      />,
    );
    const container = wrapper.getByTestId('button_mark_as_read.container');
    const flattenStyle = StyleSheet.flatten(container.props.style);
    expect(flattenStyle.backgroundColor).toBe('tomato');
  });

  it('return null if isActor=true', async () => {
    const wrapper = renderWithRedux(
      <ButtonMarkAsRead
        postId={1}
        markedReadPost={false}
        isActor
        isImportant
        expireTime="2032-05-04T08:30:00.000Z"
      />,
    );
    const container = wrapper.queryByTestId('button_mark_as_read.container');
    expect(container).toBeNull();
  });

  it('return null if markedReadPost=true and mark as read success = false as default', async () => {
    const wrapper = renderWithRedux(
      <ButtonMarkAsRead
        postId={1}
        markedReadPost
        isActor={false}
        isImportant
        expireTime="2032-05-04T08:30:00.000Z"
      />,
    );
    const container = wrapper.queryByTestId('button_mark_as_read.container');
    expect(container).toBeNull();
  });

  it('return null if isImportant=true', async () => {
    const wrapper = renderWithRedux(
      <ButtonMarkAsRead
        postId={1}
        markedReadPost={false}
        isActor={false}
        isImportant={false}
        expireTime="2032-05-04T08:30:00.000Z"
      />,
    );
    const container = wrapper.queryByTestId('button_mark_as_read.container');
    expect(container).toBeNull();
  });

  it('return null if not have expireTime', async () => {
    const wrapper = renderWithRedux(
      <ButtonMarkAsRead
        postId={1}
        markedReadPost={false}
        isActor={false}
        isImportant={false}
        expireTime=""
      />,
    );
    const container = wrapper.queryByTestId('button_mark_as_read.container');
    expect(container).toBeNull();
  });

  // can't test because update state of button
  // it(`should call putMarkAsRead when press button`, async () => {
  //   const spy = jest.spyOn(postActions, 'putMarkAsRead');
  //   const wrapper = renderWithRedux(
  //     <ButtonMarkAsRead
  //       postId={1}
  //       markedReadPost={false}
  //       isActor={false}
  //       isImportant={true}
  //     />,
  //   );
  //   const button = wrapper.getByTestId('button_mark_as_read.button');
  //   act(() => {
  //     fireEvent.press(button);
  //   });
  //   expect(spy).toBeCalled();
  // });
});

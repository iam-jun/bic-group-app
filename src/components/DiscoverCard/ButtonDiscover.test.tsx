import React from 'react';
import ButtonDiscover from './ButtonDiscover';
import { fireEvent, languages, renderWithRedux } from '../../test/testUtils';

describe('ButtonDiscover component', () => {
  it('given joinStatus = 1, should render button join', () => {
    const joinStatus = 1;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonDiscover
        joinStatus={joinStatus}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_join);
    fireEvent.press(btn);
    expect(onJoin).toBeCalled();
  });

  it('given joinStatus = 2, should render button view', () => {
    const joinStatus = 2;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonDiscover
        joinStatus={joinStatus}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_view);
    fireEvent.press(btn);
    expect(onView).toBeCalled();
  });

  it('given joinStatus = 3, should render button cancel request', () => {
    const joinStatus = 3;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonDiscover
        joinStatus={joinStatus}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_cancel_request);
    fireEvent.press(btn);
    expect(onCancel).toBeCalled();
  });
});

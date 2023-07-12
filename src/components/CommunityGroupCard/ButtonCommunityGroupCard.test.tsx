import React from 'react';
import { fireEvent, languages, renderWithRedux } from '../../test/testUtils';
import ButtonCommunityGroupCard from './ButtonCommunityGroupCard';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('ButtonCommunityGroupCard component', () => {
  it('given joinStatus = VISITOR, should render button join', () => {
    const joinStatus = GroupJoinStatus.VISITOR;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonCommunityGroupCard
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

  it('given joinStatus = MEMBER, should render button view', () => {
    const joinStatus = GroupJoinStatus.MEMBER;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonCommunityGroupCard
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

  it('given joinStatus = REQUESTED, should render button cancel request', () => {
    const joinStatus = GroupJoinStatus.REQUESTED;
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <ButtonCommunityGroupCard
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

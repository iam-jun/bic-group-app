import React from 'react';
import { mockViewContentJoinRequire } from '~/test/mock_data/post';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ContentNoPermission from './index';
import * as common from '~/helpers/common';

describe('ContentNoPermission component', () => {
  it('given requireGroups is not empty should render correctly', () => {
    const onContentLayout = jest.fn();
    const data = {
      message: mockViewContentJoinRequire.meta.message,
      requireGroups: mockViewContentJoinRequire.meta.errors.requireGroups,
    };

    const component = renderWithRedux(
      <ContentNoPermission onContentLayout={onContentLayout} data={data} />,
    );

    expect(component).toMatchSnapshot();
  });

  it('given requireGroups is empty should render correctly', () => {
    const onContentLayout = jest.fn();
    const data = {
      message: mockViewContentJoinRequire.meta.message,
      requireGroups: [],
    };

    const component = renderWithRedux(
      <ContentNoPermission onContentLayout={onContentLayout} data={data} />,
    );

    expect(component).toMatchSnapshot();
  });

  it('should push to community when pressing on community name', () => {
    const navigateToCommunityDetail = jest.spyOn(common, 'navigateToCommunityDetail');

    const onContentLayout = jest.fn();
    const data = {
      message: mockViewContentJoinRequire.meta.message,
      requireGroups: mockViewContentJoinRequire.meta.errors.requireGroups,
    };

    const component = renderWithRedux(
      <ContentNoPermission onContentLayout={onContentLayout} data={data} />,
    );

    const textCommunity = component.getByTestId(
      `content_no_permission.text_group_${mockViewContentJoinRequire.meta.errors.requireGroups[0].id}`,
    );

    fireEvent.press(textCommunity);

    expect(navigateToCommunityDetail).toBeCalled();
  });

  it('should push to group when pressing on group name', () => {
    const navigateToGroupDetail = jest.spyOn(common, 'navigateToGroupDetail');

    const onContentLayout = jest.fn();
    const data = {
      message: mockViewContentJoinRequire.meta.message,
      requireGroups: mockViewContentJoinRequire.meta.errors.requireGroups,
    };

    const component = renderWithRedux(
      <ContentNoPermission onContentLayout={onContentLayout} data={data} />,
    );

    const textGroup = component.getByTestId(
      `content_no_permission.text_group_${mockViewContentJoinRequire.meta.errors.requireGroups[1].id}`,
    );

    fireEvent.press(textGroup);

    expect(navigateToGroupDetail).toBeCalled();
  });
});

import React from 'react';
import { mockViewContentJoinRequire } from '~/test/mock_data/post';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ContentNoPermission from './index';
import * as Navigation from '~/hooks/navigation';

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

  it('should navigate to community when pressing on community name', () => {
    const navigate = jest.fn();
    jest.spyOn(Navigation, 'useRootNavigation').mockReturnValue({
      rootNavigation: {
        navigate,
      },
    } as any);
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

    expect(navigate).toBeCalled();
  });

  it('should navigate to group when pressing on group name', () => {
    const navigate = jest.fn();
    jest.spyOn(Navigation, 'useRootNavigation').mockReturnValue({
      rootNavigation: {
        navigate,
      },
    } as any);
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

    expect(navigate).toBeCalled();
  });
});

import React from 'react';

import NoGroupFound from './NoGroupFound';
import * as navigationHook from '~/hooks/navigation';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

describe('NoGroupFound component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(<NoGroupFound />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should navigate back to safety when pressing back button', () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });
    const wrapper = renderWithRedux(<NoGroupFound />);
    expect(wrapper).toMatchSnapshot();
    const button = wrapper.getByTestId('no_group_found.back');
    fireEvent.press(button);
    expect(navigate).toBeCalledWith(groupStack.groups);
  });
});

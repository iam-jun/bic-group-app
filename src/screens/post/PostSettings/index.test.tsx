import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import PostSettings from '~/screens/post/PostSettings/index';
import * as navigationHook from '~/hooks/navigation';

describe('Post Setting Screen', () => {
  it('renders correctly', () => {
    const goBack = jest.fn();
    const rootNavigation = { goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const props = { route: { params: { postId: 'test' } } };

    const wrapper = render(<PostSettings {...props} />);

    const { getByTestId } = wrapper;
    const containerComponent = getByTestId('post_settings');
    expect(containerComponent).toBeDefined();

    const btnBack = getByTestId('header.back');
    fireEvent.press(btnBack);
    expect(goBack).toBeCalled();
  });
});

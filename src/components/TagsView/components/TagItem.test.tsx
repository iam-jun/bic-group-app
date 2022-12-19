import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import { mockTagsInArticle } from '~/test/mock_data/tags';
import * as navigationHook from '~/hooks/navigation';
import TagView from './TagItem';
import { renderWithRedux } from '~/test/testUtils';

afterEach(cleanup);

describe('TagView component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate when click tag', () => {
    const item = mockTagsInArticle[0];
    const maxWidthOfTag = 100;

    const onPressTag = jest.fn();
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<TagView data={item} maxWidthOfTag={maxWidthOfTag} onPressTag={onPressTag} />);

    const buttonNavigate = wrapper.queryByTestId('tag_item.button_navigate');
    expect(buttonNavigate).toBeDefined();
    fireEvent.press(buttonNavigate);
  });
});

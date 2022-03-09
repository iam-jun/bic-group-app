import React from 'react';

import {fireEvent, renderWithRedux} from '~/test/testUtils';
import PostSelectAudience from '.';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';

describe('PostSelectAudience screen', () => {
  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<PostSelectAudience />);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call get search audience when text input change', () => {
    jest.useFakeTimers();
    const spy = jest
      .spyOn(postDataHelper, 'getSearchAudiences')
      .mockImplementation(() => {
        return Promise.resolve({data: {users: [], groups: []}});
      });
    const wrapper = renderWithRedux(<PostSelectAudience />);
    const searchInput = wrapper.getByTestId('post_select_audience.search');
    expect(searchInput).toBeDefined();
    jest.runAllTimers();
    fireEvent.changeText(searchInput, 'bein');
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledWith('bein');
  });
});

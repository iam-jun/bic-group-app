import React from 'react';

import {
  renderWithRedux,
} from '~/test/testUtils';
import PostSelectAudience from '.';

describe('PostSelectAudience screen', () => {
  it('renders correctly with params isFirstStep', async () => {
    const wrapper = renderWithRedux(
      <PostSelectAudience route={{ params: { isFirstStep: true } }} />,
    );
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  // it('should call get search audience when text input change', () => {
  //   jest.useFakeTimers();
  //   const spy = jest
  //     .spyOn(streamApi, 'getSearchAudiences')
  //     .mockImplementation(() => Promise.resolve(mockSearchResponse));
  //   jest.runOnlyPendingTimers();
  //   const wrapper = renderWithRedux(<PostSelectAudience />);
  //   const searchInput = wrapper.getByTestId('post_select_audience.search');
  //   expect(searchInput).toBeDefined();
  //   fireEvent.changeText(searchInput, 'bein');
  //   jest.runOnlyPendingTimers();
  //   expect(spy).toHaveBeenCalledWith('bein');
  // });

  // it('render correctly with group item', async () => {
  //   const state = { ...initialState };
  //   state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
  //   const store = createTestStore(state);
  //   const wrapper = renderWithRedux(<PostSelectAudience />, store);
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('render Chosen Audiences when select a group', async () => {
  //   const state = { ...initialState };
  //   state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
  //   const store = createTestStore(state);
  //   const wrapper = renderWithRedux(<PostSelectAudience />, store);
  //   const groupItems = wrapper.getAllByTestId('group_item.container');
  //   fireEvent.press(groupItems[0]);
  //   await waitForUpdateRedux();
  //   const selectingAudienceContainer = wrapper.queryByTestId(
  //     'selecting_audience.container',
  //   );
  //   expect(selectingAudienceContainer).not.toBeNull();
  // });

  // it('render correctly with 1 group selected', () => {
  //   const state = { ...initialState };
  //   state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
  //   state.post.postSelectAudienceState.selectingGroups = [mockGroupItem] as any;
  //   const store = createTestStore(state);
  //   const wrapper = renderWithRedux(<PostSelectAudience />, store);
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('not render Chosen Audiences when unselect all group', async () => {
  //   const state = { ...initialState };
  //   state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
  //   const store = createTestStore(state);
  //   const wrapper = renderWithRedux(<PostSelectAudience />, store);
  //   const groupItems = wrapper.getAllByTestId('group_item.container');
  //   fireEvent.press(groupItems[0]);
  //   await waitForUpdateRedux();
  //   fireEvent.press(groupItems[0]);
  //   await waitForUpdateRedux();
  //   const selectingAudienceContainer = wrapper.queryByTestId(
  //     'selecting_audience.container',
  //   );
  //   expect(selectingAudienceContainer).toBeNull();
  // });

//   it('not render Chosen Audiences when unselect all group in selecting panel', async () => {
//     const state = { ...initialState };
//     state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
//     const store = createTestStore(state);
//     const wrapper = renderWithRedux(<PostSelectAudience />, store);
//     const groupItems = wrapper.getAllByTestId('group_item.container');
//     fireEvent.press(groupItems[0]);
//     await waitForUpdateRedux();
//     const tagGroupItems = wrapper.getAllByTestId('tag.icon');
//     fireEvent.press(tagGroupItems[0]);
//     await waitForUpdateRedux();
//     const selectingAudienceContainer = wrapper.queryByTestId(
//       'selecting_audience.container',
//     );
//     expect(selectingAudienceContainer).toBeNull();
//   });
});

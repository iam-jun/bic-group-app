import React from 'react';

import {
  createTestStore,
  fireEvent,
  renderWithRedux,
  waitForUpdateRedux,
} from '~/test/testUtils';
import PostSelectAudience from '.';
import streamApi from '../../../api/StreamApi';
import initialState from '~/storeRedux/initialState';

const mockGroupItem = {
  id: 1,
  name: 'EVOL Community',
  description: 'The greatest community ever',
  parentId: null,
  parents: null,
  icon: '',
  children: [
    {
      id: 1,
      parentId: null,
      name: 'EVOL Community',
      slug: 'evol-community-1641809088',
      description: 'The greatest community ever',
      level: 0,
      parents: null,
      ownerId: '1',
      icon: '',
      backgroundImgUrl: null,
      group_type: 'COMPANY',
      privacy: 'PUBLIC',
      chatId: 'rpq3unai7i8ztprmoz97rdjr7w',
      createdAt: '2022-01-10T10:04:48.685Z',
      updatedAt: '2022-01-10T10:04:48.928Z',
      deletedAt: null,
      children: [],
      userCount: '25',
      unique: '5ef2593a-a47c-4419-a7ba-693e862418cb',
      testID: 'post_select_audience.groups.item',
      isChecked: false,
    },
  ],
  userCount: '25',
  unique: '6f17969b-0776-47eb-8561-6992e4acb006',
};

const mockSearchResponse = {
  code: 200,
  data: {
    groups: [],
    users: [],
  },
  meta: { message: 'Search groups successfull' },
};

describe('PostSelectAudience screen', () => {
  it('renders correctly with params isFirstStep', async () => {
    const wrapper = renderWithRedux(
      <PostSelectAudience route={{ params: { isFirstStep: true } }} />,
    );
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call get search audience when text input change', () => {
    jest.useFakeTimers();
    const spy = jest
      .spyOn(streamApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(mockSearchResponse));
    jest.runOnlyPendingTimers();
    const wrapper = renderWithRedux(<PostSelectAudience />);
    const searchInput = wrapper.getByTestId('post_select_audience.search');
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'bein');
    jest.runOnlyPendingTimers();
    expect(spy).toHaveBeenCalledWith('bein');
  });

  it('render correctly with group item', async () => {
    const state = { ...initialState };
    state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PostSelectAudience />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('render Chosen Audiences when select a group', async () => {
    const state = { ...initialState };
    state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PostSelectAudience />, store);
    const groupItems = wrapper.getAllByTestId('group_item.container');
    fireEvent.press(groupItems[0]);
    await waitForUpdateRedux();
    const selectingAudienceContainer = wrapper.queryByTestId(
      'selecting_audience.container',
    );
    expect(selectingAudienceContainer).not.toBeNull();
  });

  it('render correctly with 1 group selected', () => {
    const state = { ...initialState };
    state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
    state.post.postSelectAudienceState.selectingGroups = [mockGroupItem] as any;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PostSelectAudience />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('not render Chosen Audiences when unselect all group', async () => {
    const state = { ...initialState };
    state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PostSelectAudience />, store);
    const groupItems = wrapper.getAllByTestId('group_item.container');
    fireEvent.press(groupItems[0]);
    await waitForUpdateRedux();
    fireEvent.press(groupItems[0]);
    await waitForUpdateRedux();
    const selectingAudienceContainer = wrapper.queryByTestId(
      'selecting_audience.container',
    );
    expect(selectingAudienceContainer).toBeNull();
  });

  it('not render Chosen Audiences when unselect all group in selecting panel', async () => {
    const state = { ...initialState };
    state.post.createPost.searchResultAudienceGroups = [mockGroupItem] as any;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PostSelectAudience />, store);
    const groupItems = wrapper.getAllByTestId('group_item.container');
    fireEvent.press(groupItems[0]);
    await waitForUpdateRedux();
    const tagGroupItems = wrapper.getAllByTestId('tag.icon');
    fireEvent.press(tagGroupItems[0]);
    await waitForUpdateRedux();
    const selectingAudienceContainer = wrapper.queryByTestId(
      'selecting_audience.container',
    );
    expect(selectingAudienceContainer).toBeNull();
  });
});

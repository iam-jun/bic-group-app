import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import InfoHeader from './InfoHeader';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';

describe('InfoHeader component', () => {
  it('renders correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const rendered = renderWithRedux(<InfoHeader />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render name correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<InfoHeader />, store);
    const name = wrapper.getByTestId('info_header.name');
    expect(name.props.children).toBe(communityDetailData.name);
  });

  it('should render privacy correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<InfoHeader />, store);
    const privacy = wrapper.getByTestId('info_header.privacy');
    expect(privacy.props.children).toBe(' Public');
  });

  it('should render member count correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<InfoHeader />, store);
    const member = wrapper.getByTestId('info_header.member_count');
    expect(member.props.children).toBe(
      ` ${communityDetailData.user_count} members`,
    );
  });

  it('should render cover image', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<InfoHeader />, store);
    const cover = wrapper.getByTestId('info_header.cover');
    expect(cover).toBeDefined();
  });

  it('should render avatar image', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<InfoHeader />, store);
    const avatar = wrapper.getByTestId('avatar');
    expect(avatar).toBeDefined();
  });
});

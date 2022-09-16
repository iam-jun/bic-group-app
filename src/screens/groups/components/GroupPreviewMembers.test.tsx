import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import GroupPreviewMembers from './GroupPreviewMembers';
import initialState from '~/storeRedux/initialState';
import {
  groupDetailData,
} from '~/test/mock_data/communities';

describe('GroupPreviewMembers component', () => {
  it('should render avatar list correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = {
      ...groupDetailData,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupPreviewMembers />, store);
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(
      groupDetailData.group.members.length,
    );
  });

  it('should render member description text correctly when there is only 1 member', () => {
    const state: any = { ...initialState };
    state.groups.groupDetail = {
      group: {
        userCount: 1,
        members: [
          {
            id: 'b875af82-1113-40fc-9f21-3c2cf9e1e1dc',
            fullname: 'Lý Quân Nhạc',
            username: 'quannhac',
            avatar: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
        ],
      },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupPreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      'Lý Quân Nhạc is a member',
    );
  });

  it('should render member description text correctly when there are only 2 members', () => {
    const state: any = { ...initialState };
    state.groups.groupDetail = {
      group: {
        userCount: 2,
        members: [
          {
            id: 'b875af82-1113-40fc-9f21-3c2cf9e1e1dc',
            fullname: 'Lý Quân Nhạc',
            username: 'quannhac',
            avatar: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          {
            id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
            avatar: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/4ff5946f-d64b-48c7-883c-96438aa0f726.jpeg',
          },
        ],
      },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupPreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      'Lý Quân Nhạc and 1 other are members',
    );
  });

  it('should render member description text correctly when there are >2 members', () => {
    const state: any = { ...initialState };
    state.groups.groupDetail = {
      group: {
        userCount: 7,
        members: [...groupDetailData.group.members],
      },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupPreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      'Admin and 6 others are members',
    );
  });
});

import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import AboutContent from './AboutContent';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';

describe('AboutContent component', () => {
  it('should render description text correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    const description = wrapper.getByTestId('collapsible_text.content');
    expect(description.props.children).toBe(communityDetailData.description);
  });

  it('should render member item correctly', () => {
    const wrapper = renderWithRedux(<AboutContent />);
    const member = wrapper.getByTestId('about_content.members');
    expect(member).toBeDefined();
  });

  it('should render privacy item correctly', () => {
    const wrapper = renderWithRedux(<AboutContent />);
    const member = wrapper.getByTestId('about_content.privacy');
    expect(member).toBeDefined();
  });
});

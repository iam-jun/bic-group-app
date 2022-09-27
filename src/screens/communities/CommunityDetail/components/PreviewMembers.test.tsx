import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import PreviewMembers from './PreviewMembers';
import {
  previewMemberData,
  previewMemberDetail,
} from '~/test/mock_data/communities';

describe('PreviewMembers component', () => {
  const members = previewMemberData;

  it('should render avatar list correctly', () => {
    const wrapper = renderWithRedux(<PreviewMembers userCount={10} members={members} />);
    const listView = wrapper.getByTestId('flatlist');
    expect(listView.props.data.length).toBe(previewMemberData.length);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render member description text correctly when there is only 1 member', () => {
    const wrapper = renderWithRedux(<PreviewMembers userCount={1} members={[previewMemberDetail]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render member description text correctly when there are only 2 members', () => {
    const wrapper = renderWithRedux(
      <PreviewMembers userCount={2} members={[previewMemberDetail, previewMemberDetail]} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});

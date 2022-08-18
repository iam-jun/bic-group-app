import React from 'react';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import CommunityItem from './CommunityItem';
import { communityDetailData } from '~/test/mock_data/communities';
import { ICommunity } from '~/interfaces/ICommunity';

describe('CommunitItem component', () => {
  it('should render data correctly', () => {
    const itemData = { ...communityDetailData } as ICommunity;
    const wrapper = renderWithRedux(<CommunityItem item={itemData} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onPressCommunitties when press community item', () => {
    const onPressCommunities = jest.fn();
    const itemData = { ...communityDetailData } as ICommunity;
    const wrapper = renderWithRedux(
      <CommunityItem item={itemData} onPressCommunities={onPressCommunities} />,
    );
    const item = wrapper.getByTestId('community_item');
    fireEvent.press(item);
    expect(onPressCommunities).toBeCalled();
  });
});

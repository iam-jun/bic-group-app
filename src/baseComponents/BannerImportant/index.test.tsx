import React from 'react';
import { communityDetailData } from '~/test/mock_data/communities';

import BannerImportant from '.';
import { renderWithRedux } from '~/test/testUtils';

describe('BannerImportant component', () => {
  it('renders active banner correctly', () => {
    const rendered = renderWithRedux(
      <BannerImportant
        markedAsRead={false}
        isExpired={false}
        isImportant
        listCommunity={[communityDetailData]}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders inactive banner correctly', () => {
    const rendered = renderWithRedux(
      <BannerImportant
        markedAsRead
        isExpired={false}
        isImportant
        listCommunity={[communityDetailData]}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders default banner when this post is not important', () => {
    const rendered = renderWithRedux(
      <BannerImportant
        markedAsRead
        isExpired
        isImportant={false}
        listCommunity={[communityDetailData]}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders empty when list community = 0 and is not important', () => {
    const rendered = renderWithRedux(
      <BannerImportant
        markedAsRead
        isExpired
        isImportant={false}
        listCommunity={[]}
      />,
    ).toJSON();
    expect(rendered).toBeNull();
  });
});

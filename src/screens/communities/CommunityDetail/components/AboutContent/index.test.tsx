/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import AboutContent from '.';
import {
  communityDetailData,
  previewMemberDetail,
} from '~/test/mock_data/communities';

describe('AboutContent component', () => {
  const communityDetail = {
    ...communityDetailData,
    members: [previewMemberDetail, previewMemberDetail],
  };

  it('should render correctly', () => {
    // @ts-ignore
    const wrapper = renderWithRedux(<AboutContent profileInfo={communityDetail} />);
    expect(wrapper).toMatchSnapshot();
  });
});

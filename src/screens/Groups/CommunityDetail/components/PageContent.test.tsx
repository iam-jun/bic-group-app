import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import PageContent from './PageContent';

describe('PageContent', () => {
  const onScroll = jest.fn();
  const onButtonLayout = jest.fn();

  it('should render InfoHeader correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent onScroll={onScroll} onButtonLayout={onButtonLayout} />,
    );
    const infoHeaderComp = wrapper.getByTestId('info_header');
    expect(infoHeaderComp).toBeDefined();
  });

  it('should render About button correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent onScroll={onScroll} onButtonLayout={onButtonLayout} />,
    );
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    expect(aboutBtn).toBeDefined();
  });

  it('should render Members button correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent onScroll={onScroll} onButtonLayout={onButtonLayout} />,
    );
    const memberBtn = wrapper.getByTestId('page_content.members_btn');
    expect(memberBtn).toBeDefined();
  });
});

import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import PageContent from './PageContent';

describe('PageContent', () => {
  it('should render InfoHeader correctly', () => {
    const wrapper = renderWithRedux(<PageContent />);
    const infoHeaderComp = wrapper.getByTestId('info_header');
    expect(infoHeaderComp).toBeDefined();
  });

  it('should render About button correctly', () => {
    const wrapper = renderWithRedux(<PageContent />);
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    expect(aboutBtn).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Members button correctly', () => {
    const wrapper = renderWithRedux(<PageContent />);
    const memberBtn = wrapper.getByTestId('page_content.members_btn');
    expect(memberBtn).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});

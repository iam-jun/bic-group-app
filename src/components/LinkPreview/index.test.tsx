import React from 'react';
import { cloneDeep } from 'lodash';
import { LINK_PREVIEW_CREATE_POST } from '~/test/mock_data/linkPreview';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import LinkPreview from './index';
import * as link from '~/utils/link';

describe('LinkPreview component', () => {
  const props = {
    data: LINK_PREVIEW_CREATE_POST,
    loadLinkPreview: jest.fn(),
    onClose: jest.fn(),
    showClose: true,
  };

  it('renders loading', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.isLoading = true;

    const rendered = renderWithRedux(<LinkPreview {...propsClone} />);
    const { getByTestId } = rendered;

    const containerComponent = getByTestId('link_preview.loading');
    expect(containerComponent).toBeDefined();
  });

  it('renders correctly', () => {
    const spyOpenUrl = jest.spyOn(link, 'openUrl');

    const rendered = renderWithRedux(<LinkPreview {...props} />);
    const { getByTestId } = rendered;

    const containerComponent = getByTestId('link_preview');
    expect(containerComponent).toBeDefined();
    fireEvent.press(containerComponent);
    expect(spyOpenUrl).toBeCalled();

    const btnClose = getByTestId('link_preview.close_btn');
    fireEvent.press(btnClose);
    expect(props.onClose).toBeCalled();
  });

  it('renders null', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.url = null;

    const rendered = renderWithRedux(<LinkPreview {...propsClone} />);
    const { queryByTestId } = rendered;

    const containerComponent = queryByTestId('link_preview');
    expect(containerComponent).toBeNull();
  });

  it('renders when only attribute url', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.description = null;
    propsClone.data.domain = null;
    propsClone.data.title = null;

    renderWithRedux(<LinkPreview {...propsClone} />);

    expect(props.loadLinkPreview).toBeCalled();
  });
});

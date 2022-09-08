import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { renderWithRedux } from '~/test/testUtils';
import AtMention from '.';
import colors from '~/theme/theme';

afterEach(cleanup);

describe('AtMention component', () => {
  const baseProps = {
    showSpectialItems: false,
    emptyContent: 'emptyContent',
    cursorPosition: 0,
    onCompletePress: jest.fn(),
  };

  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<AtMention {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should hide "AtMention" with empty content when data is empty', async () => {
    const wrapper = renderWithRedux(<AtMention {...baseProps} />);
    const component = wrapper.getByTestId('at_mention.empty_content');

    expect(component).not.toBeNull();

    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.gray40);
  });

  it('should show "AtMention" with loading', async () => {
    const wrapper = renderWithRedux(<AtMention {...baseProps} />);
    const component = wrapper.getByTestId('at_mention.loading');

    expect(component).not.toBeNull();

    expect(component.props.color).toBe(colors.light.colors.gray30);
  });

  it('should hide loading', async () => {
    const wrapper = renderWithRedux(<AtMention {...baseProps} />);
    const component = wrapper.queryByTestId('at_mention.loading');

    expect(component).toBeNull();
  });

  it('should show "AtMention" with item all', async () => {
    const props = { ...baseProps, showSpectialItems: true };
    const wrapper = renderWithRedux(<AtMention {...props} />);
    const component = wrapper.getByTestId('at_mention');

    expect(component.props.data[0].username).toBe('all');
  });

  it('should show "AtMention" with items', async () => {
    const wrapper = renderWithRedux(<AtMention {...baseProps} />);
    const component = wrapper.getByTestId('at_mention_item');

    expect(component).not.toBeNull();
  });
});

import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
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

  const mockStore = configureStore([]);

  it('renders correctly', async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should hide "AtMention" with empty content when data is empty', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [];
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention.empty_content');

    expect(component).not.toBeNull();

    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.gray40);
  });

  it('should show "AtMention" with loading', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [] as any;
    storeData.mentionInput.loading = true;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention.loading');

    expect(component).not.toBeNull();

    expect(component.props.color).toBe(colors.light.colors.gray30);
  });

  it('should hide loading', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [] as any;
    storeData.mentionInput.loading = false;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.queryByTestId('at_mention.loading');

    expect(component).toBeNull();
  });

  it('should show "AtMention" with item all', async () => {
    const storeData = { ...initialState };
    const store = mockStore(storeData);
    const props = { ...baseProps, showSpectialItems: true };
    const wrapper = renderWithRedux(<AtMention {...props} />, store);
    const component = wrapper.getByTestId('at_mention');

    expect(component.props.data[0].username).toBe('all');
  });

  it('should show "AtMention" with items', async () => {
    const storeData = { ...initialState };
    const item = { username: 'test', name: 'test' };
    storeData.mentionInput.data = [item] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention_item');

    expect(component).not.toBeNull();
  });
});

import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/store/initialState';
import colors from '~/theme/theme';
import MentionBar from '.';

afterEach(cleanup);

describe('MentionBar component', () => {
  const baseProps = {
    type: 'mentionInput',
  };

  const mockStore = configureStore([]);

  it('renders correctly', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<MentionBar {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders null', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [];
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<MentionBar {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show "MentionBar" in horizontal', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<MentionBar {...baseProps} />, store);
    const component = wrapper.getByTestId('mention_bar.list');

    expect(component).not.toBeNull();

    expect(component.props.horizontal).toBeTruthy();
    expect(component.props.showsHorizontalScrollIndicator).toBeFalsy();
  });

  it('should show "MentionBar" with Divider', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
      { username: 'test2', name: 'test2', avatar: 'test2' },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<MentionBar {...baseProps} />, store);
    const component = wrapper.getByTestId('mention_bar.list.divider');

    expect(component).not.toBeNull();

    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).toBe(undefined);
    expect(flattenedStyle.backgroundColor).toBe(colors.light.colors.gray40);
  });
});

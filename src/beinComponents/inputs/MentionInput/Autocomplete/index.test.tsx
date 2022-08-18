import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import Autocomplete, { IModalPosition } from '.';

afterEach(cleanup);

describe('Autocomplete component', () => {
  const baseProps = {
    type: 'mentionInput',
    topPosition: 0,
    measuredHeight: 100,
    cursorPosition: 0,
    modalPosition: 'top' as IModalPosition,
    onCompletePress: jest.fn(),
  };

  const mockStore = configureStore([]);

  it('renders correctly', async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should hide "Autocomplete"', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [];
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />, store);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).toEqual(0);
  });

  it('should show "Autocomplete"', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />, store);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).not.toEqual(1);
  });

  it('should show "Autocomplete" in "top"', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const measuredHeight = 200;
    const props = {
      ...baseProps,
      measuredHeight,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />, store);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.bottom).toEqual(measuredHeight);
  });

  it('should show "Autocomplete" in "fullWidth"', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const props = {
      ...baseProps,
      fullWidth: true,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />, store);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.width).toEqual('100%');
  });

  it('should show "Autocomplete" with shadow', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [
      { username: 'test', name: 'test', avatar: 'test' },
    ] as any;
    const store = mockStore(storeData);
    const props = {
      ...baseProps,
      showShadow: true,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />, store);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.shadowOffset).not.toBeNull();
  });
  it('should show "Autocomplete" with title', async () => {
    const storeData = { ...initialState };
    storeData.mentionInput.data = [];
    storeData.mentionInput.key = '' as any;
    const store = mockStore(storeData);
    const props = {
      ...baseProps,
      title: 'title',
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />, store);
    const component = wrapper.getByTestId('autocomplete.title');

    expect(component).not.toBeNull();
  });
});

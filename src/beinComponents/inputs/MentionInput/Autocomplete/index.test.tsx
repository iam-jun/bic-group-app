import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { renderWithRedux } from '~/test/testUtils';
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

  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should hide "Autocomplete"', async () => {
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).toEqual(0);
  });

  it('should show "Autocomplete"', async () => {
    const wrapper = renderWithRedux(<Autocomplete {...baseProps} />);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).not.toEqual(1);
  });

  it('should show "Autocomplete" in "top"', async () => {
    const measuredHeight = 200;
    const props = {
      ...baseProps,
      measuredHeight,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.bottom).toEqual(measuredHeight);
  });

  it('should show "Autocomplete" in "fullWidth"', async () => {
    const props = {
      ...baseProps,
      fullWidth: true,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.width).toEqual('100%');
  });

  it('should show "Autocomplete" with shadow', async () => {
    const props = {
      ...baseProps,
      showShadow: true,
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />);
    const component = wrapper.getByTestId('autocomplete');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.shadowOffset).not.toBeNull();
  });
  it('should show "Autocomplete" with title', async () => {
    const props = {
      ...baseProps,
      title: 'title',
    };
    const wrapper = renderWithRedux(<Autocomplete {...props} />);
    const component = wrapper.getByTestId('autocomplete.title');

    expect(component).not.toBeNull();
  });
});

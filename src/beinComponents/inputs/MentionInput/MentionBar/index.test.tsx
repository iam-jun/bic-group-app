import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { StyleSheet } from 'react-native';
import { renderWithRedux } from '~/test/testUtils';
import colors from '~/theme/theme';
import MentionBar from '.';

afterEach(cleanup);

describe('MentionBar component', () => {
  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<MentionBar />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders null', async () => {
    const wrapper = renderWithRedux(<MentionBar />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show "MentionBar" in horizontal', async () => {
    const wrapper = renderWithRedux(<MentionBar />);
    const component = wrapper.getByTestId('mention_bar.list');

    expect(component).not.toBeNull();

    expect(component.props.horizontal).toBeTruthy();
    expect(component.props.showsHorizontalScrollIndicator).toBeFalsy();
  });

  it('should show "MentionBar" with Divider', async () => {
    const wrapper = renderWithRedux(<MentionBar />);
    const component = wrapper.getByTestId('mention_bar.list.divider');

    expect(component).not.toBeNull();

    const flattenedStyle = StyleSheet.flatten(component.props.style);

    expect(flattenedStyle.height).toBe(undefined);
    expect(flattenedStyle.backgroundColor).toBe(colors.light.colors.gray40);
  });
});

import React from 'react';
import {StyleSheet} from 'react-native';
import {cleanup} from '@testing-library/react-native';

import {configureStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import initialState from '~/store/initialState';
import AtMentionItem from './AtMentionItem';
import {colors} from '~/theme';

afterEach(cleanup);

describe('AtMentionItem component', () => {
  const baseProps = {
    showSpectialItems: false,
    item: {
      username: 'test',
      name: 'test',
    },
    onPress: jest.fn(),
  };

  const mockStore = configureStore([]);

  it(`renders correctly`, async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<AtMentionItem {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "AtMentionItem" with highlight item`, async () => {
    const storeData = {...initialState};
    const highlightItem: any = {
      username: 'test',
      name: 'test',
    };
    storeData.mentionInput.data = [
      {
        username: 'abc',
        name: 'abc',
      },
      highlightItem,
    ] as any;
    storeData.mentionInput.highlightItem = highlightItem;
    const store = mockStore(storeData);
    const props = {
      ...baseProps,
      item: highlightItem,
    };
    const wrapper = renderWithRedux(<AtMentionItem {...props} />, store);
    const component = wrapper.getByTestId('at_mention_item');
    expect(component).not.toBeNull();
    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.backgroundColor).toBe(colors.light.colors.neutral5);
  });

  it(`should show "AtMentionItem" with item all`, async () => {
    const store = mockStore(initialState);
    const props = {
      ...baseProps,
      showSpectialItems: true,
    };
    const wrapper = renderWithRedux(<AtMentionItem {...props} />, store);
    const component = wrapper.getByTestId('at_mention_item');

    expect(component).not.toBeNull();
  });

  it(`should call "_onPressItem"`, async () => {
    const onPress = jest.fn();
    const storeData = {...initialState};
    storeData.mentionInput.data = [
      {
        username: 'test',
        name: 'test',
      },
    ] as any;
    const store = mockStore(storeData);
    const props = {
      ...baseProps,
      onPress,
    };
    const wrapper = renderWithRedux(<AtMentionItem {...props} />, store);
    const component = wrapper.getByTestId('at_mention_item.touchable');
    expect(component).not.toBeNull();
    fireEvent.press(component);
    expect(onPress).toBeCalled();
  });
});

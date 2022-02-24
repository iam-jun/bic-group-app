import React from 'react';
import {StyleSheet} from 'react-native';
import {cleanup} from '@testing-library/react-native';

import {configureStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import initialState from '~/store/initialState';
import AtMentionItem from '.';
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
        username: '1',
        name: '1',
      },
      highlightItem,
    ] as any;
    storeData.mentionInput.highlightItem = highlightItem;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMentionItem {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention.item_1');
    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.backgroundColor).toBe(
      colors.light.colors.placeholder,
    );
  });

  it(`should show "AtMentionItem" with item all`, async () => {
    const storeData = {...initialState};
    storeData.mentionInput.data = [
      {
        username: 'all',
        name: 'all',
      },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMentionItem {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention_item.item_all');

    expect(component).not.toBeNull();
  });

  it(`should call "_onPressItem"`, async () => {
    const _onPressItem = jest.fn();
    const storeData = {...initialState};
    storeData.mentionInput.data = [
      {
        username: 'all',
        name: 'all',
      },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMentionItem {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention_item.item_all');
    fireEvent.press(component);
    expect(_onPressItem).toBeCalled();
  });
});

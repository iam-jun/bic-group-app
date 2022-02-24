import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {configureStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import AtMention from '.';

afterEach(cleanup);

describe('AtMention component', () => {
  const baseProps = {
    showSpectialItems: false,
    emptyContent: 'emptyContent',
    cursorPosition: 0,
    onCompletePress: jest.fn(),
  };

  const mockStore = configureStore([]);

  it(`renders correctly`, async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should hide "AtMention" with empty content when data is empty`, async () => {
    const storeData = {...initialState};
    storeData.mentionInput.data = [];
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.queryByTestId('at_mention.empty_content');

    expect(component).not.toBeNull();
  });

  it(`should show "AtMention" with loading`, async () => {
    const storeData = {...initialState};
    storeData.mentionInput.data = [] as any;
    storeData.mentionInput.loading = true;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention.loading');

    expect(component).not.toBeNull();
  });

  it(`should show "AtMention" with item`, async () => {
    const storeData = {...initialState};
    const item = {username: 'test', name: 'test'};
    storeData.mentionInput.data = [item] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AtMention {...baseProps} />, store);
    const component = wrapper.getByTestId('at_mention.item_0');

    expect(component).not.toBeNull();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { View } from 'react-native';
import { cleanup } from '@testing-library/react-native';

import { renderWithRedux, configureStore } from '../../test/testUtils';
import CommonModal from './index';
import initialState from '../../storeRedux/initialState';

afterEach(cleanup);

describe('CommonModal component', () => {
  const mockStore = configureStore([]);

  const fake_data = {
    isOpen: true,
    ContentComponent: <View style={{ height: 100, backgroundColor: 'blue' }} />,
    props: {
      modalStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    },
  };

  it('renders correctly', () => {
    const storeData = { ...initialState };
    storeData.modal.modal = fake_data;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommonModal />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with useAppBottomSheet = false', () => {
    const storeData = { ...initialState };
    // @ts-ignore
    storeData.modal.modal = { ...fake_data, useAppBottomSheet: false };
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommonModal />, store);

    expect(rendered.toJSON()).toMatchSnapshot();

    const customModalComponent = rendered.getByTestId('common_modal.center');
    expect(customModalComponent).toBeDefined();
  });
});

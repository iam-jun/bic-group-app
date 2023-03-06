/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { View } from 'react-native';
import { cleanup } from '@testing-library/react-native';

import { renderWithRedux } from '../../test/testUtils';
import CommonModal from './index';
import useModalStore from '~/store/modal';

afterEach(cleanup);

describe('CommonModal component', () => {
  const fake_data = {
    isOpen: true,
    ContentComponent: <View style={{ height: 100, backgroundColor: 'blue' }} />,
    props: {
      modalStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    },
  };

  it('renders correctly', () => {
    useModalStore.setState((state) => {
      state.modal = fake_data;
      return state;
    });
    const rendered = renderWithRedux(<CommonModal />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with useAppBottomSheet = false', () => {
    useModalStore.setState((state) => {
      state.modal = { ...fake_data, useAppBottomSheet: false };
      return state;
    });
    const rendered = renderWithRedux(<CommonModal />);

    expect(rendered.toJSON()).toMatchSnapshot();

    const customModalComponent = rendered.getByTestId('common_modal.center');
    expect(customModalComponent).toBeDefined();
  });
});

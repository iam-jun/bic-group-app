import * as React from 'react';
import {View} from 'react-native';
import {cleanup, waitFor} from '@testing-library/react-native';

import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import CommonModal from './CommonModal';
import initialState from '~/store/initialState';

afterEach(cleanup);

describe('CommonModal component', () => {
  const mockStore = configureStore([]);

  const fake_data = {
    isOpen: true,
    ContentComponent: <View style={{height: 100, backgroundColor: 'blue'}} />,
    props: {
      modalStyle: {borderTopLeftRadius: 20, borderTopRightRadius: 20},
    },
  };

  it(`renders correctly`, () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.modal.modal = fake_data;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommonModal />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with useAppBottomSheet = false`, () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.modal.modal = {...fake_data, useAppBottomSheet: false};
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommonModal />, store);

    expect(rendered.toJSON()).toMatchSnapshot();

    const customModalComponent = rendered.getByTestId('common_modal.center');
    expect(customModalComponent).toBeDefined();
  });

  it(`renders correctly style with appModalStyle`, () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.modal.modal = {
      ...fake_data,
      useAppBottomSheet: false,
      appModalStyle: {height: 200},
    };
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommonModal />, store);

    expect(rendered.toJSON()).toMatchSnapshot();

    const customModalComponent = rendered.getByTestId('common_modal.center');
    expect(customModalComponent).toBeDefined();
    expect(customModalComponent.props.style?.height).toBe(200);
  });
});

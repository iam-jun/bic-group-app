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

  it(`renders correctly`, async () => {
    const storeData = {...initialState};
    // @ts-ignore
    storeData.modal.modal = fake_data;
    const store = mockStore(storeData);

    const rendered = await waitFor(() =>
      renderWithRedux(<CommonModal />, store),
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});

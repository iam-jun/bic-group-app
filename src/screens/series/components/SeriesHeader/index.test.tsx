import * as React from 'react';
import initialState from '~/storeRedux/initialState';
import modalActions from '~/storeRedux/modal/actions';
import { mockSeries } from '~/test/mock_data/series';
import { configureStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesHeader from '.';
import * as navigationHook from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

describe('SeriesContent component', () => {
  let Keyboard: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('render correctly', () => {
    const wrapper = renderWithRedux(<SeriesHeader series={mockSeries} disabled={false} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should go to series detail when press header', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<SeriesHeader series={mockSeries} disabled={false} />);
    const contentComponent = wrapper.getByTestId('content_header');
    expect(contentComponent).toBeDefined();

    fireEvent.press(contentComponent);
    expect(navigate).toBeCalledWith(seriesStack.seriesDetail, { seriesId: mockSeries.id });
  });

  it('should call action show bottom sheet menu when press menu icon', () => {
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);
    const spyModalActions = jest.spyOn(modalActions, 'showBottomList');

    const wrapper = renderWithRedux(<SeriesHeader series={mockSeries} />, store);

    const iconMenu = wrapper.getByTestId('content_header.menu');
    expect(iconMenu).toBeDefined();
    fireEvent.press(iconMenu);

    expect(spyModalActions).toBeCalled();
  });
});

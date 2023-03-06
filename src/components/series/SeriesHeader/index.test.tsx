import * as React from 'react';
import { mockSeries } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesHeader from '.';
import * as navigationHook from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import useModalStore from '~/store/modal';

describe('SeriesContent component', () => {
  let Keyboard: any;

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
    const showBottomList = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showBottomList } as any;
      return state;
    });

    const wrapper = renderWithRedux(<SeriesHeader series={mockSeries} />);

    const iconMenu = wrapper.getByTestId('content_header.menu');
    expect(iconMenu).toBeDefined();
    fireEvent.press(iconMenu);

    expect(showBottomList).toBeCalled();
  });
});

import React from 'react';
import { act, renderHook, renderWithRedux } from '~/test/testUtils';
import BoxListPinContent from './index';
import usePinContentStore from '../../store';
import { mockArticle } from '~/test/mock_data/article';
import { listPinData } from '~/test/mock_data/pinContent';
import streamApi from '~/api/StreamApi';

describe('BoxListPinContent component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: listPinData }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('1');
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<BoxListPinContent id="1" />);
    const { queryByTestId } = rendered;
    const listPin = queryByTestId('box_list_pin_content.flatlist');
    expect(listPin).toBeDefined();
  });

  it('should renders loading view', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: [mockArticle] }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('1');
    });
    expect(spy).toBeCalled();

    const rendered = renderWithRedux(<BoxListPinContent id="1" />);
    const { queryByTestId } = rendered;
    const loadingView = queryByTestId('box_list_pin_content.loading_view');
    expect(loadingView).toBeDefined();
  });

  it('should render ItemSeparator', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: listPinData }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('1');
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<BoxListPinContent id="1" />);
    const { getByTestId } = rendered;
    const listPin = getByTestId('box_list_pin_content.flatlist');
    expect(listPin.props.ItemSeparatorComponent()).toBeDefined();
  });

  it('should render ViewSpacing when data empty', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: [] }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('1');
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<BoxListPinContent id="1" />);
    const { queryByTestId } = rendered;
    const listPin = queryByTestId('box_list_pin_content.flatlist');
    const loadingView = queryByTestId('box_list_pin_content.loading_view');
    expect(listPin).toBe(null);
    expect(loadingView).toBe(null);
  });
});

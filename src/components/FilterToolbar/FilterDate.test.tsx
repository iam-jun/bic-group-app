import React from 'react';
import {
  act, fireEvent, renderHook, renderWithRedux,
} from '~/test/testUtils';
import { TypeFilter } from './constants';
import FilterDate from './FilterDate';
import { endOfTime, startOfTime } from './helper';
import useFilterToolbarStore from './store';

describe('FilterDate component', () => {
  it('should render without init data correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { datePosted } = result.current;
    const { startDate, endDate } = datePosted || {};
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterDate startDate={startDate} endDate={endDate} onSelect={onSelect} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render with init data correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterDatePosted({
        startDate: '2023-02-11T03:26:05+00:00',
        endDate: '2023-02-13T03:26:05+00:00',
      });
    });

    const { datePosted } = result.current;
    const { startDate, endDate } = datePosted || {};
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterDate startDate={startDate} endDate={endDate} onSelect={onSelect} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should pressable', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { datePosted } = result.current;
    const { startDate, endDate } = datePosted || {};
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterDate startDate={startDate} endDate={endDate} onSelect={onSelect} />);

    const btnToday = rendered.getByTestId(`btn_option_select_date_${TypeFilter.Today}`);
    const btnYesterday = rendered.getByTestId(`btn_option_select_date_${TypeFilter.Yesterday}`);
    const btnLast7Days = rendered.getByTestId(`btn_option_select_date_${TypeFilter.LastSevenDays}`);

    fireEvent.press(btnToday);
    expect(onSelect).toBeCalled();

    fireEvent.press(btnYesterday);
    expect(onSelect).toBeCalled();

    fireEvent.press(btnLast7Days);
    expect(onSelect).toBeCalled();
  });

  it('should show icon selected correctly', () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterDate
      startDate={startOfTime(
        TypeFilter.Yesterday,
      ).toISOString()}
      endDate={endOfTime(TypeFilter.Yesterday).toISOString()}
      onSelect={onSelect}
    />);

    const iconCheck = rendered.getByTestId(`filter_date.check_${TypeFilter.Yesterday}`);
    expect(iconCheck).toBeDefined();
  });

  it('should show datepicker when pressing on select from to button', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { datePosted } = result.current;
    const { startDate, endDate } = datePosted || {};
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterDate startDate={startDate} endDate={endDate} onSelect={onSelect} />);

    const btnFromTo = rendered.getByTestId('btn_select_from_to_date');

    act(() => {
      fireEvent.press(btnFromTo);
    });

    const datepicker = rendered.getByTestId('filter_date');
    expect(datepicker).toBeDefined();
  });
});

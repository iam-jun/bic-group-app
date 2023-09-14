import React from 'react';
import { fireEvent, renderWithRedux, waitFor } from '~/test/testUtils';
import FilterDate from './FilterDate';
import { TypeFilter } from '../constants';
import { endOfTime, startOfTime } from '../helper';
import CommonModal from '~/components/CommonModal';

describe('FilterDate component', () => {
  it('should render with init data correctly', () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterDate
        startDate="2023-09-09T17:00:00.000Z"
        endDate="2023-09-14T16:59:59.999Z"
        onSelect={onSelect}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should pressable on today option', () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterDate startDate="" endDate="" onSelect={onSelect} />,
    );

    const optionToday = rendered.getByTestId(
      `filter_date.option_${TypeFilter.Today}`,
    );

    fireEvent.press(optionToday);

    expect(onSelect).toBeCalled();
    expect(onSelect.mock.calls[0][0]).toBe(
      startOfTime(TypeFilter.Today).toISOString(),
    );
    expect(onSelect.mock.calls[0][1]).toBe(
      endOfTime(TypeFilter.Today).toISOString(),
    );
  });

  it('should pressable on yesterday option', () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterDate startDate="" endDate="" onSelect={onSelect} />,
    );

    const optionYesterday = rendered.getByTestId(
      `filter_date.option_${TypeFilter.Yesterday}`,
    );

    fireEvent.press(optionYesterday);

    expect(onSelect).toBeCalled();
    expect(onSelect.mock.calls[0][0]).toBe(
      startOfTime(TypeFilter.Yesterday).toISOString(),
    );
    expect(onSelect.mock.calls[0][1]).toBe(
      endOfTime(TypeFilter.Yesterday).toISOString(),
    );
  });

  it('should pressable on lastSevenDays option', () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <FilterDate startDate="" endDate="" onSelect={onSelect} />,
    );

    const optionYesterday = rendered.getByTestId(
      `filter_date.option_${TypeFilter.LastSevenDays}`,
    );

    fireEvent.press(optionYesterday);

    expect(onSelect).toBeCalled();
    expect(onSelect.mock.calls[0][0]).toBe(
      startOfTime(TypeFilter.LastSevenDays).toISOString(),
    );
    expect(onSelect.mock.calls[0][1]).toBe(
      endOfTime(TypeFilter.LastSevenDays).toISOString(),
    );
  });

  it('should pressable on custom option', async () => {
    const onSelect = jest.fn();

    const rendered = renderWithRedux(
      <>
        <FilterDate
          startDate="2023-09-09T17:00:00.000Z"
          endDate="2023-09-14T16:59:59.999Z"
          onSelect={onSelect}
        />
        <CommonModal />
      </>,
    );

    const optionCustomTag = rendered.getByTestId(
      'filter_date.option_custom_tag',
    );

    fireEvent.press(optionCustomTag);

    await waitFor(() => {
      const dateModalPicker = rendered.getByTestId('filter_date');
      expect(dateModalPicker).toBeDefined();
    });
  });
});

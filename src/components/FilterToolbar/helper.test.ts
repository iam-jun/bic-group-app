import { TypeFilter } from './constants';
import {
  endOfTime, getCurrentFilterByTimeRange, isLastSevenDays, startOfTime,
} from './helper';

describe('FilterToolbar component', () => {
  it('given time range of the last 7 days, isLastSevenDays function should return true', () => {
    const selectedStartDate = startOfTime(
      TypeFilter.LastSevenDays,
    ).toISOString();
    const selectedEndDate = endOfTime(
      TypeFilter.LastSevenDays,
    ).toISOString();
    expect(isLastSevenDays(selectedStartDate, selectedEndDate)).toBeTruthy();
  });

  it('given time range, getCurrentFilterByTimeRange function should return TypeFilter correctly', () => {
    let selectedStartDate = null;
    let selectedEndDate = null;

    expect(getCurrentFilterByTimeRange(selectedStartDate, selectedEndDate)).toEqual(TypeFilter.All);

    selectedStartDate = startOfTime(
      TypeFilter.Today,
    ).toISOString();
    selectedEndDate = endOfTime(
      TypeFilter.Today,
    ).toISOString();

    expect(getCurrentFilterByTimeRange(selectedStartDate, selectedEndDate)).toEqual(TypeFilter.Today);

    selectedStartDate = startOfTime(
      TypeFilter.Yesterday,
    ).toISOString();
    selectedEndDate = endOfTime(
      TypeFilter.Yesterday,
    ).toISOString();

    expect(getCurrentFilterByTimeRange(selectedStartDate, selectedEndDate)).toEqual(TypeFilter.Yesterday);

    selectedStartDate = startOfTime(
      TypeFilter.LastSevenDays,
    ).toISOString();
    selectedEndDate = endOfTime(
      TypeFilter.LastSevenDays,
    ).toISOString();

    expect(getCurrentFilterByTimeRange(selectedStartDate, selectedEndDate)).toEqual(TypeFilter.LastSevenDays);

    selectedStartDate = '2023-02-08T17:00:00.000Z';
    selectedEndDate = '2023-02-13T16:59:59.999Z';

    expect(getCurrentFilterByTimeRange(selectedStartDate, selectedEndDate)).toEqual(TypeFilter.FromTo);
  });
});

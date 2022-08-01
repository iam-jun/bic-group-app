import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import TimeView from '.';
import {
  formatShortTime,
  formatFullTime,
  formatDateTime,
} from './helper';
import { languages } from '~/test/testUtils';

afterEach(cleanup);

describe('TimeView component', () => {
  const currentData = new Date();
  const date = new Date(currentData.setHours(0, 0, 0, 0)).toISOString();

  it('renders correctly', () => {
    const time = moment('20/10/2020', 'DD/MM/YYYY').toISOString();
    const rendered = render(<TimeView time={time} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly with time empty', () => {
    const rendered = render(<TimeView time="" />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.children).toBeDefined();
  });

  it('renders correctly with props style', () => {
    const rendered = render(
      <TimeView time={date} style={{ color: '#FF9800' }} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    const flattenedStyle = StyleSheet.flatten(timeComponent.props.style);
    expect(flattenedStyle).toMatchObject({ color: '#FF9800' });
  });

  it('renders correctly with props textProps', () => {
    const rendered = render(
      <TimeView time={date} textProps={{ numberOfLines: 2 }} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.props.numberOfLines).toEqual(2);
  });

  it('renders correctly with propstime', () => {
    const date = new Date('2022-02-02 00:00:00');
    const { getByTestId, getByText } = render(<TimeView time={date} />);
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(
      getByText(`Feb 02 ${languages.common.time.at} 12:00 AM`),
    ).toBeDefined();
  });

  it('renders correctly with props type fullDateTime', () => {
    const date = new Date('2022-02-02 00:00:00');
    const { getByTestId, getByText } = render(
      <TimeView time={date} type="fullDateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(
      getByText(`Feb 02 ${languages.common.time.at} 12:00 AM`),
    ).toBeDefined();
  });

  it('renders correctly with props type dateTime', () => {
    const date = new Date('2022-02-02 00:00:00');
    const { getByTestId, getByText } = render(
      <TimeView time={date} type="dateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText('Feb 02, 2022')).toBeDefined();
  });

  it('renders correctly with props type short', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setMinutes(dateTime.getMinutes() - 5),
    ).toISOString();
    const { getByTestId, getByText } = render(
      <TimeView time={time} type="short" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(`5${languages.common.time.short_min}`)).toBeDefined();
  });

  it('function formatShortTime with now', () => {
    const now = moment.utc();
    expect(formatShortTime(now, 'vi')).toMatch(languages.common.time.now);
  });

  it('function formatShortTime with 5 minutes ago', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setMinutes(dateTime.getMinutes() - 5),
    ).toISOString();
    expect(formatShortTime(time, 'en')).toMatch(
      `5${languages.common.time.short_min}`,
    );
  });

  it('function formatShortTime with 5 hour ago', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setHours(dateTime.getHours() - 5),
    ).toISOString();
    expect(formatShortTime(time, 'en')).toMatch(
      `5${languages.common.time.short_hour}`,
    );
  });

  it('function formatShortTime with 5 days ago', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 5),
    ).toISOString();
    expect(formatShortTime(time, 'en')).toMatch(
      `5${languages.common.time.short_day}`,
    );
  });

  it('function formatShortTime with 1 weeks ago', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 10),
    ).toISOString();
    expect(formatShortTime(time, 'en')).toMatch(
      `1${languages.common.time.short_week}`,
    );
  });

  it('function formatShortTime with date display', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setMonth(dateTime.getMonth() - 13),
    ).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM/YYYY'),
    );
  });

  it('function formatFullTime', () => {
    expect(formatFullTime(date, 'vi')).toMatch(
      `${languages.common.time.today} ${languages.common.time.at}`,
    );
  });

  it('function formatFullTime with yesterday', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 1),
    ).toISOString();
    expect(formatFullTime(time, 'vi')).toMatch(
      `${languages.common.time.yesterday} ${languages.common.time.at}`,
    );
  });

  it('function formatFullTime with date display', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 5),
    ).toISOString();
    expect(formatFullTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM, hh:mm A'),
    );
  });

  it('funtion formatDateTime', () => {
    expect(formatDateTime(date, 'vi')).toMatch(languages.common.time.today);
  });

  it('funtion formatDateTime with yesterday', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 1),
    ).toISOString();
    expect(formatDateTime(time, 'vi')).toMatch(languages.common.time.yesterday);
  });

  it('funtion formatDateTime with date display', () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 13),
    ).toISOString();
    expect(formatDateTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM/yyyy'),
    );
  });
});

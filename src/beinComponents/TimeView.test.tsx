import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import TimeView, {
  formatShortTime,
  formatFullTime,
  formatDateTime,
} from '~/beinComponents/TimeView';
import moment from 'moment';

afterEach(cleanup);

describe('TimeView component', () => {
  const currentData = new Date();
  const date = new Date(currentData.setHours(0, 0, 0, 0)).toISOString();
  it(`renders correctly`, () => {
    const rendered = render(<TimeView time={date} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly with props style`, () => {
    const rendered = render(
      <TimeView time={date} style={{color: '#FF9800'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.props.style).toMatchObject({color: '#FF9800'});
  });

  it(`renders correctly with props textProps`, () => {
    const rendered = render(
      <TimeView time={date} textProps={{numberOfLines: 2}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.props.numberOfLines).toEqual(2);
  });

  it(`renders correctly with propstime`, () => {
    const {getByTestId, getByText} = render(<TimeView time={date} />);
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today common:time:at/)).toBeDefined();
  });

  it(`renders correctly with props type fullDateTime`, () => {
    const {getByTestId, getByText} = render(
      <TimeView time={date} type="fullDateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today common:time:at/)).toBeDefined();
  });

  it(`renders correctly with props type dateTime`, () => {
    const {getByTestId, getByText} = render(
      <TimeView time={date} type="dateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today/)).toBeDefined();
  });

  it(`renders correctly with props type short`, () => {
    const {getByTestId, getByText} = render(
      <TimeView time={date} type="short" />,
    );
    expect(
      render(<TimeView time={date} type="short" />).toJSON(),
    ).toMatchSnapshot();
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:short_hour/)).toBeDefined();
  });

  it(`function formatShortTime`, () => {
    expect(formatShortTime(date, 'vi')).toMatch(/common:time:short_hour/);
  });

  it(`function formatShortTime with now`, () => {
    const now = moment.utc();
    expect(formatShortTime(now, 'vi')).toMatch(/common:time:now/);
  });

  it(`function formatShortTime with 5 minutes ago`, () => {
    const dateTime = new Date();
    const time = new Date(dateTime.setMinutes(5, 0, 0)).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(/common:time:short_min/);
  });

  it(`function formatShortTime with 5 hour ago`, () => {
    const dateTime = new Date();
    const time = new Date(dateTime.setHours(5, 0, 0, 0)).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(/common:time:short_hour/);
  });

  it(`function formatShortTime with 5 days ago`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 5),
    ).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(/common:time:short_day/);
  });

  it(`function formatShortTime with 1 weeks ago`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 10),
    ).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(/common:time:short_week/);
  });

  it(`function formatShortTime with date display`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setMonth(dateTime.getMonth() - 13),
    ).toISOString();
    expect(formatShortTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM/YYYY'),
    );
  });

  it(`function formatFullTime`, () => {
    expect(formatFullTime(date, 'vi')).toMatch(
      /common:time:today common:time:at/,
    );
  });

  it(`function formatFullTime with yesterday`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 1),
    ).toISOString();
    expect(formatFullTime(time, 'vi')).toMatch(
      /common:time:yesterday common:time:at/,
    );
  });

  it(`function formatFullTime with date display`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 5),
    ).toISOString();
    expect(formatFullTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM, hh:mm A'),
    );
  });

  it(`funtion formatDateTime`, () => {
    expect(formatDateTime(date, 'vi')).toMatch(/common:time:today/);
  });

  it(`funtion formatDateTime with yesterday`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 1),
    ).toISOString();
    expect(formatDateTime(time, 'vi')).toMatch(/common:time:yesterday/);
  });

  it(`funtion formatDateTime with date display`, () => {
    const dateTime = new Date();
    const time = new Date(
      dateTime.setDate(dateTime.getDate() - 13),
    ).toISOString();
    expect(formatDateTime(time, 'vi')).toMatch(
      moment(time).format('DD/MM/yyyy'),
    );
  });
});

import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import TimeView from '~/beinComponents/TimeView';

afterEach(cleanup);

describe('TimeView component', () => {
  const currentData = new Date();
  const date = new Date(currentData.setHours(0, 0, 0, 0)).toISOString();
  it(`renders correctly`, () => {
    const rendered = render(<TimeView time={date} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`style`, () => {
    const rendered = render(
      <TimeView time={date} style={{color: '#FF9800'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.props.style).toMatchObject({color: '#FF9800'});
  });

  it(`textProps`, () => {
    const rendered = render(
      <TimeView time={date} textProps={{numberOfLines: 2}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const timeComponent = rendered.getByTestId('time_view');
    expect(timeComponent).toBeDefined();
    expect(timeComponent.props.numberOfLines).toEqual(2);
  });

  it(`time`, () => {
    const {getByTestId, getByText} = render(<TimeView time={date} />);
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today common:time:at/)).toBeDefined();
  });

  it(`type fullDateTime`, () => {
    const {getByTestId, getByText} = render(
      <TimeView time={date} type="fullDateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today common:time:at/)).toBeDefined();
  });

  it(`type dateTime`, () => {
    const {getByTestId, getByText} = render(
      <TimeView time={date} type="dateTime" />,
    );
    const timeComponent = getByTestId('time_view');
    expect(timeComponent.children).toBeDefined();
    expect(getByText(/common:time:today/)).toBeDefined();
  });

  it(`type short`, () => {
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
});

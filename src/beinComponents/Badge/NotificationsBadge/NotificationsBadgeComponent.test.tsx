import React from 'react';
import {render, cleanup} from '@testing-library/react-native';

import NotificationsBadgeComponent from './NotificationsBadgeComponent';
import {colors} from '~/theme';

afterEach(cleanup);

describe('NotificationsBadgeComponent', () => {
  const testID = 'notifications_badge_component';
  const number = 5;

  it(`renders correctly`, () => {
    const rendered = render(
      <NotificationsBadgeComponent number={number} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders variant alert correctly`, () => {
    const {getByTestId} = render(
      <NotificationsBadgeComponent
        variant="alert"
        number={number}
        testID={testID}
      />,
    );
    const viewComponent = getByTestId('notifications_badge_component');
    expect(viewComponent.props.style.backgroundColor).toBe(
      colors.light.colors.error,
    );
    //@ts-ignore
    expect(viewComponent.children[0].props.style.color).toBe(
      colors.light.colors.textReversed,
    );
  });

  it(`renders view style correctly`, () => {
    const {getByTestId} = render(
      <NotificationsBadgeComponent
        style={{margin: 12}}
        variant="alert"
        number={number}
        testID={testID}
      />,
    );
    const viewComponent = getByTestId('notifications_badge_component');
    //@ts-ignore
    expect(viewComponent.props.style.margin).toBe(12);
  });

  it(`renders number value that is smaller than maxNumber correctly`, () => {
    const {getByTestId} = render(
      <NotificationsBadgeComponent
        variant="alert"
        number={number}
        testID={testID}
      />,
    );
    const viewComponent = getByTestId('notifications_badge_component');
    //@ts-ignore
    expect(viewComponent.children[0].props.children).toBe(number.toString());
  });

  it(`renders maxNumber correctly`, () => {
    const maxNumber = 99;

    const {getByTestId} = render(
      <NotificationsBadgeComponent
        variant="alert"
        number={100}
        maxNumber={maxNumber}
        testID={testID}
      />,
    );
    const viewComponent = getByTestId('notifications_badge_component');
    //@ts-ignore
    expect(viewComponent.children[0].props.children).toBe(`${maxNumber}+`);
  });

  it(`renders textStyle correctly`, () => {
    const {getByTestId} = render(
      <NotificationsBadgeComponent
        variant="alert"
        number={100}
        textStyle={{fontSize: 20}}
        testID={testID}
      />,
    );
    const viewComponent = getByTestId('notifications_badge_component');
    //@ts-ignore
    expect(viewComponent.children[0].props.style.fontSize).toBe(20);
  });
});

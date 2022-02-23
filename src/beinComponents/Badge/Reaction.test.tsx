import React from 'react';

import {cleanup, renderWithRedux, fireEvent} from '~/test/testUtils';
import Reaction from './Reaction';
import {colors} from '~/theme';

afterEach(cleanup);

describe('Reaction component', () => {
  const value = 10;
  const icon = 'kissing_closed_eyes';
  const selected = false;
  const onActionPress = jest.fn();

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        onActionPress={onActionPress}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders value correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        onActionPress={onActionPress}
      />,
    );

    const childrenComponent = getByTestId('reaction.children');
    expect(childrenComponent.props.children[1]).toEqual(` ${value}`);
  });

  it('renders icon correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        onActionPress={onActionPress}
      />,
    );

    const childrenComponent = getByTestId(`reaction.${icon}`);
    expect(childrenComponent.props.children).toBeDefined();
  });

  it('renders selected = false correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={false}
        icon={icon}
        onActionPress={onActionPress}
      />,
    );

    const childrenComponent = getByTestId('reaction.children');
    expect(childrenComponent.props.style.color).toEqual(
      colors.light.colors.textPrimary,
    );

    const reactionComponent = getByTestId('reaction');
    expect(reactionComponent.props.style.backgroundColor).toEqual(
      colors.light.colors.placeholder,
    );
    expect(reactionComponent.props.style.borderColor).toEqual(
      colors.light.colors.placeholder,
    );
  });

  it('renders selected = true correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={true}
        icon={icon}
        onActionPress={onActionPress}
      />,
    );

    const childrenComponent = getByTestId('reaction.children');
    expect(childrenComponent.props.style.color).toEqual(
      colors.light.colors.primary7,
    );

    const reactionComponent = getByTestId('reaction');
    expect(reactionComponent.props.style.backgroundColor).toEqual(
      colors.light.colors.primary2,
    );
    expect(reactionComponent.props.style.borderColor).toEqual(
      colors.light.colors.primary6,
    );
  });

  it(`should call prop onActionPress correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        onActionPress={onActionPress}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    fireEvent.press(reactionComponent);
    expect(onActionPress).toBeCalled();
  });

  it(`should call prop onLongPress correctly`, () => {
    const onLongPress = jest.fn();

    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        onActionPress={onActionPress}
        onLongPress={onLongPress}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    fireEvent(reactionComponent, 'onLongPress');
    expect(onLongPress).toBeCalled();
  });

  it('renders style correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        style={{margin: 12}}
        onActionPress={onActionPress}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    expect(reactionComponent.props.style.margin).toBe(12);
  });

  it('renders loading correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        loading
        onActionPress={onActionPress}
      />,
    );

    const indicatorComponent = getByTestId('reaction.indicator');
    expect(indicatorComponent).toBeDefined();

    const button = getByTestId('reaction');
    fireEvent.press(button);
    expect(onActionPress).not.toBeCalled();
  });

  it('renders disableUpdateState with selected=false correctly', () => {
    const {getByTestId} = renderWithRedux(
      <Reaction
        value={value}
        selected={selected}
        icon={icon}
        disableUpdateState
        onActionPress={onActionPress}
      />,
    );

    const button = getByTestId('reaction');
    expect(button.props.style.backgroundColor).toEqual(
      colors.light.colors.placeholder,
    );
    expect(button.props.style.borderColor).toEqual(
      colors.light.colors.placeholder,
    );

    fireEvent.press(button);
    expect(onActionPress).toBeCalled();

    // expect the colors to be the same
    expect(button.props.style.backgroundColor).toEqual(
      colors.light.colors.placeholder,
    );
    expect(button.props.style.borderColor).toEqual(
      colors.light.colors.placeholder,
    );
  });
});

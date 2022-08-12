import React from 'react';

import { cleanup, renderWithRedux, fireEvent } from '~/test/testUtils';
import colors from '~/theme/theme';
import {Default} from './index.stories';

afterEach(cleanup);

describe('Reaction component', () => {
  const onActionPress = jest.fn();

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <Default {...Default.args}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call prop onActionPress to select Emoji correctly', () => {
    const { getByTestId } = renderWithRedux(
      <Default
      {...Default.args}
        selected={true}
        onActionPress={onActionPress}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    fireEvent.press(reactionComponent);
    expect(onActionPress).toBeCalled();
  });

  it('should call prop onLongPress correctly', () => {
    const onLongPress = jest.fn();

    const { getByTestId } = renderWithRedux(
      <Default
        {...Default.args}
        onLongPress={onLongPress}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    fireEvent(reactionComponent, 'onLongPress');
    expect(onLongPress).toBeCalled();
  });

  it('renders style correctly', () => {
    const { getByTestId } = renderWithRedux(
      <Default
       {...Default.args}
        style={{ backgroundColor: "red" }}
      />,
    );

    const reactionComponent = getByTestId('reaction');
    expect(reactionComponent.props.style.backgroundColor).toBe("red");
  });

  it('renders disableUpdateState with selected=false correctly', () => {
    const { getByTestId } = renderWithRedux(
      <Default
        {...Default.args}
        disableUpdateState
        onActionPress={onActionPress}
      />,
    );

    const button = getByTestId('reaction');
    expect(button.props.style.backgroundColor).toEqual(
      colors.light.colors.neutral2,
    );
    expect(button.props.style.borderColor).toEqual(
      colors.light.colors.neutral2,
    );

    fireEvent.press(button);
    expect(onActionPress).toBeCalled();

    // expect the colors to be the same
    expect(button.props.style.backgroundColor).toEqual(
      colors.light.colors.neutral2,
    );
    expect(button.props.style.borderColor).toEqual(
      colors.light.colors.neutral2,
    );
  });
});

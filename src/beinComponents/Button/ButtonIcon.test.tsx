import React from 'react';

import {renderWithRedux, cleanup, fireEvent} from '~/test/testUtils';
import colors from '~/theme/theme';

import ButtonIcon from './ButtonIcon';

afterEach(cleanup);

describe('ButtonDanger conponent', () => {
  const children = 'Button Icon';

  const testID = 'button_icon.test';

  const icon = 'iconSend';

  const label = 'BUTTON ICON';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ButtonIcon icon={icon} testID={testID} />,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('renders label correctly', () => {
    const rendered = renderWithRedux(
      <ButtonIcon icon={icon} label={label} testID={testID} />,
    );
    const labelComponent = rendered.getByTestId('button_icon.label');

    expect(labelComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders style correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonIcon icon={icon} style={{margin: 12}} testID={testID} />,
    );

    const component = getByTestId('button_icon');

    expect(component.props.style[1].margin).toBe(12);
  });

  it('renders iconWrapperStyle correctly', () => {
    const rendered = renderWithRedux(
      <ButtonIcon
        icon={icon}
        iconWrapperStyle={{backgroundColor: 'red'}}
        testID={testID}
      />,
    );

    const component = rendered.getByTestId(testID);

    expect(component.props.style.backgroundColor).toBe('red');
  });
});

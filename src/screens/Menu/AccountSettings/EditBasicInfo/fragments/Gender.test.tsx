import React from 'react';

import { cleanup, fireEvent, render } from '~/test/testUtils';

import Gender from './Gender';
import { GENDER_TYPE } from '~/interfaces/IEditUser';

afterEach(cleanup);

describe('Gender conponent', () => {
  it('should render correctly when gender not set', () => {
    const setGenderState = jest.fn();

    const rendered = render(
      <Gender genderState={undefined} setGenderState={setGenderState} />,
    );

    const maleComponent = rendered.getByTestId('settings.male');
    expect(maleComponent).toBeDefined();

    const femaleComponent = rendered.getByTestId('settings.female');
    expect(femaleComponent).toBeDefined();

    const othersGenderComponent = rendered.getByTestId('settings.others');
    expect(othersGenderComponent).toBeDefined();
  });

  it('should call prop setGenderState when press in gender', () => {
    const setGenderState = jest.fn();
    const gender = GENDER_TYPE.FEMALE;

    const rendered = render(
      <Gender genderState={gender} setGenderState={setGenderState} />,
    );

    const maleComponent = rendered.getByTestId('settings.male');
    expect(maleComponent).toBeDefined();

    fireEvent.press(maleComponent);

    expect(setGenderState).toHaveBeenCalledWith(GENDER_TYPE.MALE);
  });

  it('should call prop setGenderState when press in female', () => {
    const setGenderState = jest.fn();

    const rendered = render(
      <Gender genderState={undefined} setGenderState={setGenderState} />,
    );

    const femaleComponent = rendered.getByTestId('settings.female');
    expect(femaleComponent).toBeDefined();
    fireEvent.press(femaleComponent);

    expect(setGenderState).toHaveBeenCalledWith(GENDER_TYPE.FEMALE);
  });

  it('should call prop setGenderState when press in others', () => {
    const setGenderState = jest.fn();

    const rendered = render(
      <Gender genderState={undefined} setGenderState={setGenderState} />,
    );

    const othersGenderComponent = rendered.getByTestId('settings.others');
    expect(othersGenderComponent).toBeDefined();
    fireEvent.press(othersGenderComponent);

    expect(setGenderState).toHaveBeenCalledWith(GENDER_TYPE.OTHERS);
  });
});

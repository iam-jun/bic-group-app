import React from 'react';
import { validateRules } from './helper';

describe('FormCheckPassword helper', () => {
  const formValidate = {
    isLimitCharacter: false,
    isUppercaseLetter: false,
    isLowercaseLetter: false,
    isDigits: false,
    isSpecialCharacter: false,
  };
  it('should validate success', () => {
    const result = {
      isLimitCharacter: true,
      isUppercaseLetter: true,
      isLowercaseLetter: true,
      isDigits: true,
      isSpecialCharacter: true,
    };
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const fn = validateRules('12345678@Aa', formValidate, setStateMock);
    expect(fn).toEqual(result);
  });

  it('should validate failed', () => {
    const result = { ...formValidate, isLowercaseLetter: true };
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const fn = validateRules('a', formValidate, setStateMock);
    expect(fn).toEqual(result);
  });
});

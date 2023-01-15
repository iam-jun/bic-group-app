import React from 'react';
import { validate } from './helper';

describe('CodeInputView helper', () => {
  const formValidate = {
    isLimitCharacter: false,
    isUppercaseLetter: false,
    isDigits: false,
    isSpecialCharacter: false,
  };
  it('should validate success', () => {
    const result = {
      isLimitCharacter: true,
      isUppercaseLetter: true,
      isDigits: true,
      isSpecialCharacter: true,
    };
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const fn = validate('12345678@A', formValidate, setStateMock);
    expect(fn).toEqual(result);
  });

  it('should validate failed', () => {
    const result = { ...formValidate };
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const fn = validate('a', formValidate, setStateMock);
    expect(fn).toEqual(result);
  });
});

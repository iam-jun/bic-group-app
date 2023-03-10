import { IFormCheckPassword } from '~/interfaces/IAuth';
import * as validation from '~/constants/commonRegex';

export const validateRules = (
  value: string,
  state: IFormCheckPassword,
  setState: (value: IFormCheckPassword) => void,
) => {
  const formClone = { ...state };
  if (validation.limitCharacterRegex.test(value)) {
    formClone.isLimitCharacter = true;
  } else {
    formClone.isLimitCharacter = false;
  }
  if (validation.uppercaseLetterRegex.test(value)) {
    formClone.isUppercaseLetter = true;
  } else {
    formClone.isUppercaseLetter = false;
  }
  if (validation.lowercaseLetterRegex.test(value)) {
    formClone.isLowercaseLetter = true;
  } else {
    formClone.isLowercaseLetter = false;
  }
  if (validation.digitsRegex.test(value)) {
    formClone.isDigits = true;
  } else {
    formClone.isDigits = false;
  }
  if (validation.specialCharacterRegex.test(value)) {
    formClone.isSpecialCharacter = true;
  } else {
    formClone.isSpecialCharacter = false;
  }
  setState(formClone);
  return formClone;
};

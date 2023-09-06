import { isEmpty } from 'lodash';
import i18n from 'i18next';
import { IOptionItem } from '~/interfaces/IEditUser';
import * as validation from '~/constants/commonRegex';

export const errorTextArray = [
  i18n.t('profile:fullname_rule:not_allow_number'),
  i18n.t('profile:fullname_rule:not_allow_special_character'),
  i18n.t('profile:fullname_rule:character_length'),
];

export const dataMapping = (dataObject: any): IOptionItem[] => {
  if (isEmpty(dataObject)) return [];
  const dataList = Object.keys(dataObject).map((type) => ({
    type,
    title: dataObject[type],
  }));
  return dataList;
};

export const maxBirthday = () => {
  const currentMoment = new Date();
  const currentDay = currentMoment.getDate();
  const currentMonth = currentMoment.getMonth();
  const currentYear = currentMoment.getFullYear();

  // user must be at least 8 years old up to today
  const maxDateToSelect = new Date(
    currentYear - 8, currentMonth, currentDay,
  );
  return maxDateToSelect;
};

export const checkFullName = (fullName: string, currentErrorText: string) => {
  const errorArray = [];

  if (/\d/.test(fullName)) {
    errorArray.push(errorTextArray[0]);
  }

  if (fullName?.length > 0 && !validation.fullNameRegex.test(fullName)) {
    errorArray.push(errorTextArray[1]);
  }

  if ((fullName.length < 3 || fullName.length > 64)) {
    errorArray.push(errorTextArray[2]);
  }

  if (currentErrorText?.length > 0 && errorArray.length > 0) {
    const isExist = errorArray.find((item) => item === currentErrorText);
    return isExist ? currentErrorText : errorArray[0];
  }
  if (!currentErrorText && errorArray.length > 0) {
    return errorArray[0];
  }
  return '';
};

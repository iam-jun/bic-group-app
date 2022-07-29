import { IOptionItem } from '~/interfaces/IEditUser';

export const dataMapping = (dataObject: any): IOptionItem[] => {
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

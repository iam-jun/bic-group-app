import { isEmpty } from 'lodash';
import { formatDate } from '~/utils/formatter';
import useUserProfileStore from './store';

export const getLanguages = (language: string[]) => {
  if (isEmpty(language)) return '';

  const mapLanguages = useUserProfileStore.getState().languages.reduce((acc, cur) => ({
    ...acc,
    [cur.code]: cur,
  }), {});

  const userLanguageList = language?.map((
    code: string,
  ) => mapLanguages[code]?.local);

  return userLanguageList?.join(', ');
};

export const getEndDateText = (
  t: any,
  currentlyWorkHere: boolean,
  endDate: string,
) => (currentlyWorkHere
  ? t('common:text_present')
  : endDate
    ? formatDate(
      endDate,
      'MMMM, YYYY',
    )
    : '');

export const formatPhoneNumber = (
  phone: string | null | undefined,
  countryCode: string,
) => (countryCode && phone ? `(${countryCode}) ${phone}` : '');

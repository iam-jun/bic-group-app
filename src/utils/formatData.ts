import moment from 'moment';
import {useBaseHook} from '~/hooks';

export const formatNumber = (n: number) => {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== ',' && (a.length - i) % 3 === 0 ? ',' + c : c;
  });
};

export const formatDate = (
  value?: string | number | Date,
  format: string = 'L',
  maxFromDays: number = 2,
) => {
  var formats = [moment.ISO_8601, 'MM/DD/YYYY HH*mm*ss'];
  const date = moment(value, formats, true);
  if (!date.isValid()) return null;

  const days = moment(new Date()).diff(date, 'days'); // today - future < 0
  if (days < maxFromDays) value = moment(value).calendar();
  else value = moment(value).format(format);

  return value;
};

export const formatText = (text_label: string, ...params: number[]): string => {
  if (!text_label) return '';
  const {t} = useBaseHook();

  let text = t(text_label);
  params.forEach((param, index) => {
    if (text.includes(`{${index}}`)) {
      text = text.replace(`{${index}}`, t(param));
    } else {
      text = `${text} ${t(param)}`;
    }
  });
  return text;
};

export const formatPhoneNumber = (text: string) => {
  if (!text) return text;
  const cleaned = ('' + text).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '',
      number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
        '',
      );

    return number;
  }
  return text;
};

export const toNumber = (text: string, decimalFixed: number) => {
  if (!text) return text;
  let fixed = decimalFixed || 2;
  let value: string | number = text;

  text = text.replace(/,/g, '.');
  if (!text.endsWith('.')) {
    if (text.includes('.')) {
      const decimalPath = text.split('.')[1];
      value = parseFloat(text).toFixed(
        decimalPath.length < fixed ? decimalPath.length : fixed,
      );
    } else {
      value = Number(text);
    }
  }
  return value;
};

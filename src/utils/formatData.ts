import moment from 'moment';

export const formatNumber = (n: number) => {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== ',' && (a.length - i) % 3 === 0 ? ',' + c : c;
  });
};

export const formatDate = (
  value: string | number | Date | moment.Moment,
  format?: string,
  locale?: string,
  maxFromDays?: number,
  fromNow = true,
) => {
  const formats = [moment.ISO_8601, 'MM/DD/YYYY HH*mm*ss'];
  const date = moment(value, formats, true);
  if (!date.isValid()) return '';

  let momentValue = moment(value);
  if (locale) {
    momentValue = momentValue.locale(locale);
  }

  if (format) {
    value = momentValue.format(format);
  } else {
    const days = moment(new Date()).diff(date, 'days'); // today - future < 0
    if (fromNow) {
      if (days < (maxFromDays || 1)) {
        value = momentValue.fromNow(true);
      } else {
        value = momentValue.format('lll');
      }
    } else {
      if (days < (maxFromDays || 1)) {
        value = momentValue.calendar();
      } else {
        value = momentValue.format('L');
      }
    }
  }

  return value || '';
};

export const formatLargeNumber = (value: number) => {
  if (value < 1000) {
    return value;
  } else if (value < 10000) {
    return `${Number(value / 1000)
      .toFixed(2)
      .replace(/(\.0+|0+)$/, '')}k`;
  } else if (value < 100000) {
    return `${Number(value / 1000)
      .toFixed(1)
      .replace(/(\.0+|0+)$/, '')}k`;
  } else if (value < 1000000) {
    return `${Number(value / 1000)
      .toFixed(3)
      .replace(/(\.0+|0+)$/, '')}k`;
  } else if (value < 1000000000) {
    return `${Number(value / 1000000)
      .toFixed(0)
      .replace(/(\.0+|0+)$/, '')}m`;
  } else if (value >= 1000000000) {
    return `${Number(value / 1000000000)
      .toFixed(0)
      .replace(/(\.0+|0+)$/, '')}b`;
  }
  return value;
};

export const timestampToISODate = (date: any): string => {
  if (typeof date === 'object') return new Date(date?.$date).toISOString();
  if (typeof date === 'number') return new Date(date).toISOString();
  return date;
};

export const countTime = (timeIso: string) => {
  let result = '';
  const time = moment.utc(timeIso).unix();
  const now = moment().unix();
  const deltaSecond = Math.max(now - time, time - now);
  if (deltaSecond < 60) {
    result = 'now';
  } else if (deltaSecond < 60 * 60) {
    result = Math.round(deltaSecond / 60) + 'm';
  } else if (deltaSecond < 60 * 60 * 24) {
    result = Math.round(deltaSecond / (60 * 60)) + 'h';
  } else if (deltaSecond < 60 * 60 * 24 * 7) {
    result = Math.round(deltaSecond / (60 * 60 * 24)) + 'd';
  } else if (deltaSecond < 60 * 60 * 24 * 7 * 52) {
    result = Math.round(deltaSecond / (60 * 60 * 24 * 7)) + 'w';
  } else if (deltaSecond >= 60 * 60 * 24 * 7 * 52) {
    result = Math.round(deltaSecond / (60 * 60 * 24 * 7 * 52)) + 'y';
  }
  return result;
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
  const fixed = decimalFixed || 2;
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

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

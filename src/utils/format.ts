import moment from 'moment';

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

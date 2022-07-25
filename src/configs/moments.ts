export default {
  en: {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s(number: any, withoutSuffix: any) {
        return withoutSuffix ? 'now' : 'a few seconds';
      },
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd',
      M: '1mth',
      MM: '%dmth',
      y: '1y',
      yy: '%dy',
    },
  },
  vi: {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s(number: any, withoutSuffix: any) {
        return withoutSuffix ? 'now' : 'vài giây trước';
      },
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd',
      M: '1mth',
      MM: '%dmth',
      y: '1y',
      yy: '%dy',
    },
  },
};

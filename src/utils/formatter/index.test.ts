import {
  convertArrayToObject,
  escapeMarkDown, formatBytes, formatDate, formatLargeNumber, formatNumberWithZeroPrefix, formatTextRemoveSpace,
} from '.';

describe('formatter utils', () => {
  const testDate = '2023-02-24T06:15:28.500Z';
  // const timestamp = 1676452112;

  it('should run formatDate correctly', () => {
    const test1 = formatDate(testDate, 'DD/MM/YYYY');
    expect(test1).toEqual('24/02/2023');

    const test2 = formatDate(testDate, 'll');
    expect(test2).toEqual('Feb 24, 2023');

    const test3 = formatDate(testDate);
    expect(test3).toEqual('Feb 24, 2023 1:15 PM');

    const test4 = formatDate(testDate, 'hh:mm A', undefined, 9999);
    expect(test4).toEqual('01:15 PM');

    const test5 = formatDate(testDate, undefined, 'vi');
    expect(test5).toEqual('24 Thg 02 2023 13:15');

    const test6 = formatDate(testDate, undefined, undefined, 2);
    expect(test6).toEqual('Feb 24, 2023 1:15 PM');

    const test7 = formatDate(testDate, undefined, undefined, 2, false);
    expect(test7).toEqual('02/24/2023');
  });

  it('should run formatLargeNumber correctly', () => {
    const test1 = formatLargeNumber(999);
    expect(test1).toEqual(999);

    const test2 = formatLargeNumber(9999);
    expect(test2).toEqual('10K');

    const test3 = formatLargeNumber(99999);
    expect(test3).toEqual('100K');

    const test4 = formatLargeNumber(999999);
    expect(test4).toEqual('999.999K');

    const test5 = formatLargeNumber(9999999);
    expect(test5).toEqual('1M');

    const test6 = formatLargeNumber(9999999999);
    expect(test6).toEqual('1B');
  });

  it('should run formatBytes correctly', () => {
    const test1 = formatBytes(0);
    expect(test1).toEqual('0 Bytes');

    const test2 = formatBytes(123);
    expect(test2).toEqual('123 Bytes');

    const test3 = formatBytes(1234);
    expect(test3).toEqual('1.2 KB');

    const test4 = formatBytes(1634500);
    expect(test4).toEqual('1.6 MB');

    const test5 = formatBytes(1114500000);
    expect(test5).toEqual('1 GB');
  });

  it('should run escapeMarkDown correctly', () => {
    const test1 = escapeMarkDown('**bold** abc');
    expect(test1).toEqual('bold abc');

    const test2 = escapeMarkDown('**bold** abc @username');
    expect(test2).toEqual('bold abc @username');
  });

  it('should run formatTextRemoveSpace correctly', () => {
    const test1 = formatTextRemoveSpace('');
    expect(test1).toEqual('');

    const test2 = formatTextRemoveSpace('090 101 101');
    expect(test2).toEqual('090101101');
  });

  it('should run convertArrayToObject correctly', () => {
    const test1 = convertArrayToObject(
      [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ],
    );

    expect(test1).toEqual({
      1: { id: 1, name: 'a' },
      2: { id: 2, name: 'b' },
    });

    const test2 = convertArrayToObject(
      [
        { test_id: 1, name: 'a' },
        { test_id: 2, name: 'b' },
      ],
      'test_id',
    );

    expect(test2).toEqual({
      1: { test_id: 1, name: 'a' },
      2: { test_id: 2, name: 'b' },
    });
  });

  it('should run formatNumberWithZeroPrefix correctly', () => {
    const test1 = formatNumberWithZeroPrefix(null);
    expect(test1).toEqual('');

    const test2 = formatNumberWithZeroPrefix(undefined);
    expect(test2).toEqual('');

    const test3 = formatNumberWithZeroPrefix(9);
    expect(test3).toEqual('09');

    const test4 = formatNumberWithZeroPrefix(19);
    expect(test4).toEqual(19);
  });
});

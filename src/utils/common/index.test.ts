import {
  getUrlFromText, parseSafe, searchText, titleCase,
} from '.';

describe('Commom utils', () => {
  it('should run titleCase correctly', async () => {
    const test1 = titleCase(null);
    expect(test1).toBeNull();

    const test2 = titleCase('abc');
    expect(test2).toEqual('Abc');
  });

  it('should run parseSafe correctly', async () => {
    const test1 = parseSafe(null);
    expect(test1).toBeNull();

    const test2 = parseSafe('abc');
    expect(test2).toBeUndefined();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const test3 = parseSafe({ a: 1 });
    expect(test3).toEqual({ a: 1 });

    const test4 = parseSafe('{ "a": 1 }');
    expect(test4).toEqual({ a: 1 });
  });

  it('should run getUrlFromText correctly', async () => {
    const test1 = getUrlFromText('', []);
    expect(test1).toEqual([]);

    const test2 = getUrlFromText('abc');
    expect(test2).toEqual([]);

    const test3 = getUrlFromText('abc https://google.com');
    expect(test3).toEqual(['https://google.com']);

    const test4 = getUrlFromText('abc https://google.com https://fb.com');
    expect(test4).toEqual(['https://google.com', 'https://fb.com']);
  });

  it('should run searchText correctly', async () => {
    const test1 = searchText('', null);
    expect(test1).toBe(false);

    const test2 = searchText('việt', 'Việt Nam');
    expect(test2).toEqual(true);

    const test3 = searchText('việtt', 'Việt Nam');
    expect(test3).toBe(false);

    const test4 = searchText('nam', 'Việt Nam');
    expect(test4).toEqual(true);
  });
});

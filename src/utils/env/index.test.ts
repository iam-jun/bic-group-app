import getEnv from '.';

describe('formatter utils', () => {
  it('should run getEnv correctly', () => {
    const test1 = getEnv('SELF_DOMAIN');
    expect(test1).toEqual('beincom.io');
  });
});

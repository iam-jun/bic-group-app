import ConvertHelper from '.';

describe('ConvertHelper utils', () => {
  it('should run camelizeKeys correctly', () => {
    const test1 = ConvertHelper.camelizeKeys({ test_id: '123', test_name: 'name' });
    expect(test1).toEqual({ testId: '123', testName: 'name' });
  });

  it('should run camelizeKeys correctly', () => {
    const test1 = ConvertHelper.decamelizeKeys({ testId: '123', testName: 'name' });
    expect(test1).toEqual({ test_id: '123', test_name: 'name' });
  });
});

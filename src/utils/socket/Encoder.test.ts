import Encoder from './Encoder';

describe('Encoder utils', () => {
  it('should encode correctly', () => {
    const encoder = new Encoder();
    const test = encoder.encode(1);
    const result = new Uint8Array([1]);
    expect(test).toEqual([result]);
  });
});

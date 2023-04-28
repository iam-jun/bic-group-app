import Decoder from './Decoder';

describe('Decoder utils', () => {
  it('should add correctly', () => {
    const emit = jest.fn();
    const encoder = new Decoder();
    encoder.emit = emit;

    const test1 = new Uint8Array([1]);
    encoder.add(test1);
    expect(emit).toBeCalledWith('decoded', 1);

    encoder.add('a');
    expect(emit).toBeCalledWith('decoded', 1);
  });
});

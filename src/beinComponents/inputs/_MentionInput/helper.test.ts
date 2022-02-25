import {cleanup} from '@testing-library/react-native';
import {getMatchTermForAtMention, switchKeyboardForCodeBlocks} from './helper';

afterEach(cleanup);

describe('_MentionInput helper', () => {
  it(`getMatchTermForAtMention correctly`, async () => {
    expect(getMatchTermForAtMention('test @abc', false)).toBe('abc');
  });

  it(`getMatchTermForAtMention to be null`, async () => {
    expect(getMatchTermForAtMention('test abc', false)).toBeNull();
  });

  it(`switchKeyboardForCodeBlocks to be default`, async () => {
    expect(switchKeyboardForCodeBlocks('test', 0)).toBe('default');
  });
});

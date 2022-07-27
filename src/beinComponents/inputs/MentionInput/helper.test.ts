import {cleanup} from '@testing-library/react-native';
import {
  checkRunSearch,
  completeMention,
  getMatchTermForAtMention,
  switchKeyboardForCodeBlocks,
} from './helper';

afterEach(cleanup);

describe('_MentionInput helper', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it(`getMatchTermForAtMention correctly`, async () => {
    expect(getMatchTermForAtMention('test @abc')).toBe('abc');
  });

  it(`getMatchTermForAtMention should be null`, async () => {
    expect(getMatchTermForAtMention('test abc')).toBeNull();
  });

  it(`switchKeyboardForCodeBlocks should be default`, async () => {
    expect(switchKeyboardForCodeBlocks('test', 0)).toBe('default');
  });

  it(`switchKeyboardForCodeBlocks should be email-address`, async () => {
    Platform.OS = 'ios';
    Platform.Version = 13;

    expect(switchKeyboardForCodeBlocks('```\n{test: "abc--d"}\n````', 0)).toBe(
      'email-address',
    );
  });

  it(`completeMention cursorPosition should be text's length`, async () => {
    const text = 'abc @te';
    const item = {username: 'test'};
    const result = completeMention({
      item,
      cursorPosition: undefined,
      text,
      dispatch: jest.fn(),
    });

    expect(result.cursorPosition).toBe(text.length);
    expect(result.completedDraft).toBe(`abc @${item.username} `);
  });

  it(`checkRunSearch should run`, async () => {
    expect(checkRunSearch('abc @te', ['groupId'], jest.fn)).toBeTruthy();
  });

  it(`checkRunSearch should not run`, async () => {
    expect(checkRunSearch('abc te', ['groupId'], jest.fn)).toBeFalsy();
  });
});

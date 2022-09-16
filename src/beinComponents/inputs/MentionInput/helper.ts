import { Platform } from 'react-native';
import { AT_MENTION_REGEX } from '~/constants/autocomplete';

export const getMatchTermForAtMention = (() => {
  let lastMatchTerm: string | null = null;
  let lastValue: string;
  return (value: string): string | null => {
    if (value !== lastValue) {
      const regex = AT_MENTION_REGEX;
      let term = value;
      if (term.startsWith('from: @') || term.startsWith('from:@')) {
        term = term.replace(
          '@', '',
        );
      }

      const match = term.match(regex);
      lastValue = value;
      if (match) {
        lastMatchTerm = match[2].toLowerCase();
      } else {
        lastMatchTerm = null;
      }
    }
    return lastMatchTerm;
  };
})();

export function switchKeyboardForCodeBlocks(
  value: string,
  cursorPosition: number,
) {
  if (Platform.OS === 'ios' && parseInt(
    Platform.Version, 10,
  ) >= 12) {
    const regexForCodeBlock = /^```$(.*?)^```$|^```$(.*)/gms;

    const matches = [];
    let nextMatch;
    // eslint-disable-next-line no-cond-assign
    while ((nextMatch = regexForCodeBlock.exec(value)) !== null) {
      matches.push({
        startOfMatch: regexForCodeBlock.lastIndex - nextMatch[0].length,
        endOfMatch: regexForCodeBlock.lastIndex + 1,
      });
    }

    const cursorIsInsideCodeBlock = matches.some((match) => cursorPosition >= match.startOfMatch
        && cursorPosition <= match.endOfMatch);

    // 'email-address' keyboardType prevents iOS emdash autocorrect
    if (cursorIsInsideCodeBlock) {
      return 'email-address';
    }
  }

  return 'default';
}
